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

/* MAC-адрес платы */
auto boardIdentificator = ESP.getEfuseMac();

/* SD-карта */
auto eventPoll = EventPoll("/DATA");

/* Api клиент */
auto api = Api("https://d4c0-178-214-245-19.eu.ngrok.io/Board/");

/* Wi-Fi клиент */
WiFiManager wifiClient;

/* Wi-Fi UDP */
WiFiUDP udp;

/* NTP клиент */
NTPClient timeClient(udp, "europe.pool.ntp.org", 1000, 18000);

/* Поток записи данных с сенсоров в файловую систему */
auto saveThread = Thread();

/* Поток отправки данных с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
auto sendToServerThread = Thread();

/* Датчики */
//auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);

/* Отправляет данные с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
void sendEventsToServer() {
    auto eventFile = eventPoll.getNextEventFile();

    while (eventFile)
    {
        auto event = eventFile.readString();

        // TODO: Придумать как заблокировать доступ к файлам другим потокам, пока выполняется отправка
        if (api.sendEvent(event)) 
        {
            auto filename = eventFile.name();
            eventPoll.removeEvent(eventFile);

            Serial.printf("Событие из файла %s успешно отправлено на сервер\n", filename);
        }

        eventFile = eventPoll.getNextEventFile();
    }    
}

/* Сохраняет данные с сенсоров в файловую систему */
void saveEventsToFile() {
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
    //auto axis = gyroscope.getAxis();
    gyroscopeValues["x"] = 0;
    gyroscopeValues["y"] = 0;
    gyroscopeValues["z"] = 0;

    document["charging"] = false;
    document["isFellOff"] = false;

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

/*  
    Подключает Wi-Fi клиент к точке доступа.
    В случае, если пользователь не подключился, создает собственную точку доступа и ожидает
 */
void connectToWifi() 
{
    // TODO: пофиксить авто-коннект к точке доступа (Типо Сделано)
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
}

/* Настраивает плату */
void setup() 
{
    Serial.begin(115200);

    sendToServerThread.setInterval(1000);
    sendToServerThread.onRun(sendEventsToServer);

    saveThread.setInterval(1000);
    saveThread.onRun(saveEventsToFile);

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
    timeClient.update();
    
    runThreadSafely(saveThread);
    runThreadSafely(sendToServerThread);
}