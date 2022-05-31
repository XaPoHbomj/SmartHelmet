#include <Arduino.h>
#include <Thread.h>
#include "Gyroscope/Gyroscope.h"
#include "SmokeDetector/SmokeDetector.h"
#include "Rangefinder/Rangefinder.h"
#include <WiFiManager.h>
#include <HTTPClient.h>
#include "SPI.h"
#include "FS.h"
#include "SD.h"
#include "ArduinoJson.h"
#include "NTPClient.h"
#include "WiFiUdp.h"
#include "Api/Api.h"
#include "EventPoll/EventPoll.h"
#include <Int64String.h>
#include "ImpactSensor/ImpactSensor.h"

/* MAC-адрес платы */
auto boardIdentificator = ESP.getEfuseMac();

/* SD-карта */
auto eventPoll = EventPoll("/DATA");

/* Api клиент */
auto api = Api("https://aff9-2a00-1fa1-84ec-1a9d-648d-89f0-3f32-5d22.eu.ngrok.io/Board/");

/* Wi-Fi клиент */
WiFiManager wifiClient;

/* Wi-Fi UDP */
WiFiUDP udp;

/* NTP клиент */
NTPClient timeClient(udp, "europe.pool.ntp.org", 0, 1000);

/* Поток записи данных с сенсоров в файловую систему */
auto saveThread = Thread();

/* Поток отправки данных с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
auto sendToServerThread = Thread();

/* Поток, отслеживающий изменения на датчике удара */
auto fellOffListener = Thread();

/* Датчики */
auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);
auto impactSensor = ImpactSensor(33);

/*  
    Подключает Wi-Fi клиент к точке доступа.
    В случае, если пользователь не подключился, создает собственную точку доступа и ожидает
 */
bool connectToWifi() 
{   
    wifiClient.setConnectTimeout(300);
    auto isConnected = wifiClient.autoConnect("TestConnect", "password");

    if (!isConnected)
    {
        Serial.println("Не удалось подключить к точке доступа Wi-Fi");
    }
    else
    {
        Serial.println("Подключение к точке доступа Wi-Fi прошло успешно");
    }

    return isConnected;
}

/* Отправляет данные с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
void sendEventsToServer()
{
    auto directory = eventPoll.getSource();
    auto eventFile = directory.openNextFile();

    while (eventFile)
    {
        auto filename = eventFile.name();

        if (eventFile.size() > 0) 
        {
            auto event = eventFile.readString();
            
            if (api.sendEvent(event)) 
            {
                eventPoll.removeEvent(eventFile);

                Serial.printf("Событие из файла %s успешно отправлено на сервер\n", filename);
            }
            else
            {
                Serial.println("Не удалось отправить запрос");

                break;
            }

            eventFile.close();
        }
        else 
        {
            eventPoll.removeEvent(eventFile);

            Serial.printf("Пустое событие %s было удалено\n", filename);
        }

        eventFile = directory.openNextFile();
    } 
}

/* Сохраняет данные с сенсоров в файловую систему */
void saveEventsToFile(bool isFellOff) 
{
    timeClient.update();

    DynamicJsonDocument document(1024);

    auto timestamp = timeClient.getEpochTime();
    document["boardIdentificator"] = int64String(boardIdentificator);
    document["unixTimestamp"] = timestamp;
    document["batteryLevel"] = 100.0f; // TODO: добавить вывод заряда батареи
    document["signalLevel"] = wifiClient.getRSSIasQuality(
        WiFi.RSSI()
    );

    document["distance"] = rangefinder.read();
    document["smokeValue"] = smokeDetector.read();

    auto gyroscopeValues = document.createNestedObject("gyroscope");
    auto axis = gyroscope.getAxis();
    gyroscopeValues["x"] = axis.getX();
    gyroscopeValues["y"] = axis.getY();
    gyroscopeValues["z"] = axis.getZ();

    document["charging"] = false;
    document["isFellOff"] = isFellOff;

    String json;
    serializeJson(document, json);

    if (eventPoll.saveEvent(timestamp, json))
    {
        Serial.printf
        (
            "Событие %d успешно сохранено: %s\n", 
            timestamp, 
            json.c_str()
        );
    }
}

/* Обработчик события удара по каске (падения) */
void onFellOff() 
{
    if (impactSensor.isImpacted()) 
    {
        saveEventsToFile(true);
    }
}

/* Настраивает плату */
void setup() 
{
    Serial.begin(115200);

    sendToServerThread.setInterval(10000);
    sendToServerThread.onRun(sendEventsToServer);

    saveThread.setInterval(10000);
    saveThread.onRun([]()
    {
        saveEventsToFile(false);
    });

    fellOffListener.setInterval(50);
    fellOffListener.onRun(onFellOff);

    while
    (
        !eventPoll.trySetup()
    );

    connectToWifi();
}

/* Безопасно запускает указанный поток */
void runThreadSafely(Thread& thread) 
{
    if (thread.shouldRun()) {
        thread.run();
    }
}

/* Основной цикл выполнения */
void loop() 
{ 
    runThreadSafely(saveThread);
    runThreadSafely(sendToServerThread);
    runThreadSafely(fellOffListener);
}