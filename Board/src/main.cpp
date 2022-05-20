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

/* NTP клиент */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

/* Поток записи данных в файловую систему */
auto writeDataToFileSystemThread = Thread();

/* 
    Поток отправки содержимого на сервер с предварительной проверкой наличия файлов в директории /DATA/. 
    Если имеются, то отправляет содержимое на сервер. 
*/
auto sendDataToServerThread = Thread();

/* Датчики */
auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);

/* Заполняет указанный DynamicJsonDocument данными о плате */
/* TODO: вынести в отдельный класс JSONDocumentManager */
void fillBoardData(DynamicJsonDocument& document) 
{
    document["boardIdentificator"] = boardIdentificator;
    document["dateTime"] = timeClient.getFormattedTime();
    document["batteryLevel"] = 100.0f; // TODO: добавить вывод заряда батареи
    document["signalLevel"] = wifiClient.getRSSIasQuality(
        WiFi.RSSI()
    );
}

/* Заполняет указанный DynamicJsonDocument данными с датчиков */
/* TODO: вынести в отдельный класс JSONDocumentManager*/
void fillSensorsData(DynamicJsonDocument& document) 
{
    auto gyroscopeValues = document.createNestedObject("gyroscope");
    auto axis = gyroscope.getAxis();
    gyroscopeValues["x"] = axis.getX();
    gyroscopeValues["y"] = axis.getY();
    gyroscopeValues["z"] = axis.getZ();

    document["distance"] = rangefinder.read();
    document["smokeValue"] = smokeDetector.read();
    document["isFellOff"] = false;
}

/* Выводит указанный JSON в Serial */
/* TODO: вынести в отдельный класс JSONDocumentManager*/
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
        Serial.println("Failed to connect");
    }
    else
    {
        Serial.println("Connected");
    }
}

/* Настраивает плату */
void setup() 
{
    Serial.begin(115200);

    // TODO: реализовать получение времени с платы (Сделано)
    timeClient.setTimeOffset(18000);
    timeClient.begin();

    sendDataToServerThread.setInterval(1000);
    sendDataToServerThread.onRun([]() 
    {
        auto root = SD.open("/DATA/");

        if (!root) 
        {
            Serial.println("Не удалось открыть папку /DATA/");

            return;
        }

        File file;

        do
        {
            String json;
            file = root.openNextFile();
            
            while(file.available()) {
                json += (char)file.read();
            }

            if (api.sendSensorsData(json)) {
                sdСard.deleteFile(
                    file.name()
                );
            }
        }
        while (file);

        // DynamicJsonDocument document(1024);
        // fillBoardData(document);
        // fillSensorsData(document);

        // String json;
        // serializeJson(document, json);
        // printJsonToSerial(json);
        // sendJsonToServer(json);
    });

    while
    (
        !sdСard.trySetupSecureDigitalCard()
    );

    connectToWifi();
}

/* Основной цикл */
void loop() 
{
    //printThread.safeRun();
}