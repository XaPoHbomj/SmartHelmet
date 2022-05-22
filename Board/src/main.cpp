#include <Arduino.h>
#include <Thread.h>
#include "Gyroscope/Gyroscope.h"
#include "SmokeDetector/SmokeDetector.h"
#include "Rangefinder/Rangefinder.h"
#include <WiFiManager.h>
#include <HTTPClient.h>
#include "SPI.h"
#include "SD.h"
#include "FS.h"
#include "ArduinoJson.h"
#include "NTPClient.h"
#include "WiFiUdp.h"
#include "SDCard/SDCard.h"
#include "Api/Api.h"

/* MAC-адрес платы */
auto boardIdentificator = ESP.getEfuseMac();

/* SD-карта */
auto sdСard = SDCard(SD);

/* Api клиент */
auto api = Api("https://localhost:7217/Board/");

/* Wi-Fi клиент */
WiFiManager wifiClient;

/* Wi-Fi UDP */
WiFiUDP udp;

/* NTP клиент */
NTPClient timeClient(udp, "pool.ntp.org");

/* Поток записи данных с сенсоров в файловую систему */
auto saveThread = Thread();

/* Поток отправки данных с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
auto sendToServerThread = Thread();

/* Датчики */
auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);

/* Отправляет данные с сенсоров на сервер с предварительной проверкой наличия файлов в директории /DATA/ */
void sendSensorsDataToServer() {
    auto directory = sdСard.open("/DATA/");

    if (!directory) 
    {
        Serial.println("Не удалось открыть папку /DATA/");

        return;
    }

    auto file = directory.openNextFile();

    while (file);
    {
        String json = sdСard.read(file);

        if (api.sendSensorsData(json)) {
            sdСard.deleteFile(
                file.name()
            );
        }

        file = directory.openNextFile();
    }    
}

/* Сохраняет данные с сенсоров в файловую систему */
void saveSensorsDataToFile() {
    DynamicJsonDocument document(1024);

    auto timestamp = timeClient.getFormattedTime();
    document["boardIdentificator"] = boardIdentificator;
    document["timestamp"] = timestamp;
    document["batteryLevel"] = 100.0f; // TODO: добавить вывод заряда батареи
    document["signalLevel"] = wifiClient.getRSSIasQuality(
        WiFi.RSSI()
    );

    auto gyroscopeValues = document.createNestedObject("gyroscope");
    auto axis = gyroscope.getAxis();
    gyroscopeValues["x"] = axis.getX();
    gyroscopeValues["y"] = axis.getY();
    gyroscopeValues["z"] = axis.getZ();

    document["distance"] = rangefinder.read();
    document["smokeValue"] = smokeDetector.read();
    document["isFellOff"] = false;

    String json;
    serializeJson(document, json);
    printJsonToSerial(json);

    String directory = "/ROOT/";
    auto filepath = directory + timestamp + ".txt";

    sdСard.writeContent(
        filepath.c_str(), 
        json.c_str()
    );
}

/* Выводит указанный JSON в Serial */
void printJsonToSerial(String& json) 
{
    Serial.printf("Сформировано: %s\n", json);
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

    timeClient.setTimeOffset(18000);
    timeClient.begin();

    sendToServerThread.setInterval(1000);
    sendToServerThread.onRun(sendSensorsDataToServer);

    saveThread.setInterval(1000);
    saveThread.onRun(saveSensorsDataToFile);

    while
    (
        !sdСard.trySetupSecureDigitalCard()
    );

    connectToWifi();
}

/* Безопасно запускает указанный поток */
void runThreadSafely(Thread& thread) {
    if (thread.shouldRun()) {
        thread.run();
    }
}

/* Основной цикл выполнения */
void loop() 
{
    runThreadSafely(saveThread);
    runThreadSafely(sendToServerThread);
}