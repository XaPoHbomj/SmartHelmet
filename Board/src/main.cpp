#include <Arduino.h>
#include <Thread.h>
#include "Gyroscope/Gyroscope.h"
#include "SmokeDetector/SmokeDetector.h"
#include "Rangefinder/Rangefinder.h"
#include <WiFiManager.h>
#include "SD.h"
#include "FS.h"
#include "SPI.h"

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

/* Wi-Fi клиент */
WiFiManager client;

/* Поток вывода сообщений */
auto printThread = Thread();

/* Датчики */
auto gyroscope = Gyroscope();
auto smokeDetector = SmokeDetector(32);
auto rangefinder = Rangefinder(16, 17);

/* Выводит местоположение каски */
void printAxis() 
{
    auto axis = gyroscope.getAxis();

    Serial.println("Местоположение:");
    Serial.printf
    (
        "(%.2f, %.2f, %.2f)\n\n",
        axis.getX(),
        axis.getY(),
        axis.getZ()
    );
}

/* Выводит значение уровня задымления вокруг каски */
void printSmokeValue() 
{
    auto smokeValue = smokeDetector.read();

    Serial.println("Задымленность:");
    Serial.printf("%.2f\n\n", smokeValue);
}

/* Выводит расстояние до объекта в поле зрения датчика приближения */
void printDistance() 
{
    auto distance = rangefinder.read();

    Serial.println("Расстояние:");
    Serial.printf("%.2f\n\n", distance);
}

/*  
    Подключает Wi-Fi клиент к точке доступа.
    В случае, если пользователь не подключился, создает собственную точку доступа и ожидает
 */
void connectToWifi() 
{
    auto isConnected = client.autoConnect("TestConnect", "password");

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

    printThread.setInterval(1000);
    printThread.onRun([]() 
    {
        printAxis();
        printSmokeValue();
        printDistance();
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