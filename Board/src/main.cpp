#include <Arduino.h>
#include <Thread.h>
#include "Gyroscope/Gyroscope.h"
#include "SmokeDetector/SmokeDetector.h"
#include "Rangefinder/Rangefinder.h"
#include <WiFiManager.h>
#include <HTTPClient.h>
#include "SD.h"
#include "FS.h"
#include "SPI.h"
#include "ArduinoJson.h"
#include "time.h"

/* MAC-адрес платы */
auto boardIdentificator = ESP.getEfuseMac();

/* Wi-Fi клиент */
WiFiManager wifiClient;
const char* endpoint = "https://localhost:47776/ReceiveSensorsData"; // TODO: перенести в конфигурационный файл
const char* ntpServer = "pool.ntp.org";

/* Поток вывода сообщений */
auto sendDataToServerThread = Thread();

/* Датчики */
auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);

/* Пытается инициализировать SD карту и определяет ее доступность */
bool trySetupSecureDigitalCard() 
{
    if (!SD.begin())
    {
        Serial.println("SD Card mount failed");

        return false;
    }

    auto cardType = SD.cardType();

    if (cardType == CARD_NONE || cardType == CARD_UNKNOWN)
    {
        Serial.println("SD Card is missing");

        return false;
    }

    Serial.printf("SD Card Type: %d\n", cardType);
    auto mibs = 1024 * 1024;

    Serial.printf
    (
        "SD Card size: %llu MiB\n", 
        SD.cardSize() / mibs
    );

    Serial.printf
    (
        "Total space: %llu MiB\n", 
        SD.totalBytes() / mibs
    );

    Serial.printf
    (
        "Used space: %llu MiB\n", 
        SD.usedBytes() / mibs
    );

    return true;
}

/* Заполняет указанный DynamicJsonDocument данными о плате */
void fillBoardData(DynamicJsonDocument& document) {
    document["boardIdentificator"] = boardIdentificator;
    document["dateTime"] = "29.04.2022"; // TODO: добавить запись времени
    document["batteryLevel"] = 100.0f; // TODO: добавить вывод заряда батареи
    document["signalLevel"] = wifiClient.getRSSIasQuality(
        WiFi.RSSI()
    );
}

/* Заполняет указанный DynamicJsonDocument данными с датчиков */
void fillSensorsData(DynamicJsonDocument& document) {
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
void printJsonToSerial(const char* json) {
    Serial.printf("Сформировано: %s\n", json);
}

/* Отправляет JSON на сервер */
void sendJsonToServer(const char* json) {
    // TODO: Добавить проверки на подключение к интернету (?) и на успешную отправку данных
    HTTPClient httpClient;
    httpClient.begin(endpoint);

    httpClient.addHeader("Content-Type", "application/json");
    auto responseCode = httpClient.POST(json);
    
    httpClient.end();
}

/*  
    Подключает Wi-Fi клиент к точке доступа.
    В случае, если пользователь не подключился, создает собственную точку доступа и ожидает
 */
void connectToWifi() 
{
    // TODO: пофиксить авто-коннект к точке доступа
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

    // TODO: реализовать получение времени с платы
    configTime(0, 0, ntpServer);
    tm timeinfo;
    getLocalTime(&timeinfo);

    sendDataToServerThread.setInterval(1000);
    sendDataToServerThread.onRun([]() 
    {
        DynamicJsonDocument document(1024);
        fillBoardData(document);
        fillSensorsData(document);

        const char* json;
        serializeJson(document, json);
        printJsonToSerial(json);
        sendJsonToServer(json);
    });

    while
    (
        !trySetupSecureDigitalCard()
    );

    connectToWifi();
}

/* Основной цикл */
void loop() 
{
    //printThread.safeRun();
}