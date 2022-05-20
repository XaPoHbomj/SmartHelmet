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

/* MAC-адрес платы */
auto boardIdentificator = ESP.getEfuseMac();

SDCard sdcard;

/* Wi-Fi клиент */
WiFiManager wifiClient;
const char* endpoint = "https://localhost:7217/Board/ReceiveSensorsData"; // TODO: перенести в конфигурационный файл

/* NTP клиент */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

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

/* Вспомогательные процедуры для работы с файловой системой */
void createDir(fs::FS &fs, const char * path) {
  Serial.printf("Creating Dir: %s\n", path);
  if(fs.mkdir(path)){
    Serial.println("Dir created");
  } else {
    Serial.println("mkdir failed");
  }
}

void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if(!file){
    Serial.println("Failed to open file for writing");
    return;
  }
  if(file.print(message)){
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  file.close();
}

void deleteFile(fs::FS &fs, const char * path) {
  Serial.printf("Deleting file: %s\n", path);
  if(fs.remove(path)){
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}

void printJsonToFile(String &json) {
    String path = "/DATA/" + timeClient.getFormattedTime() + ".txt";
    writeFile(SD, path.c_str(), json.c_str());
}

/* Проверяет наличие файлов в директории /DATA/. Если имеются, то отправляет содердимое на сервер. */
auto CheckFiles = Thread();

/* Заполняет указанный DynamicJsonDocument данными о плате */
/* TODO: вынести в отдельный класс JSONDocumentManager*/
void fillBoardData(DynamicJsonDocument& document) {
    document["boardIdentificator"] = boardIdentificator;
    document["dateTime"] = timeClient.getFormattedTime();
    document["batteryLevel"] = 100.0f; // TODO: добавить вывод заряда батареи
    document["signalLevel"] = wifiClient.getRSSIasQuality(
        WiFi.RSSI()
    );
}

/* Заполняет указанный DynamicJsonDocument данными с датчиков */
/* TODO: вынести в отдельный класс JSONDocumentManager*/
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
/* TODO: вынести в отдельный класс JSONDocumentManager*/
void printJsonToSerial(String& json) {
    Serial.printf("Сформировано: %s\n", json);
}

/* Отправляет JSON на сервер */
/* TODO: вынести в отдельный класс JSONDocumentManager*/
bool sendJsonToServer(String& json) {
    HTTPClient httpClient;
    auto res = httpClient.begin(endpoint);

    if (res) {
        httpClient.addHeader("Content-Type", "application/json");
        auto responseCode = httpClient.POST(json);
        httpClient.end();
        if (responseCode >= 200 && responseCode < 300) {
            Serial.println("POST Success");
            return true;
        }
        else {
            Serial.println("POST Fail");
            return false;
        }
        return true;
    }
    else {
        Serial.println("Fail to connect to HTTP");
        return false;
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
        DynamicJsonDocument document(1024);
        fillBoardData(document);
        fillSensorsData(document);

        String json;
        serializeJson(document, json);
        printJsonToSerial(json);
        sendJsonToServer(json);
    });
    
    /* TODO: Протестировать работоспособность */
    CheckFiles.setInterval(1000);
    CheckFiles.onRun([]()
    {
        File root = SD.open("/DATA/");
        if(!root) {
            Serial.println("Failed to open directory");
            return;
        }
        if(!root.isDirectory()) {
            Serial.println("Not a directory");
            return;
        }

        File file = root.openNextFile();
        while(file) {
            String json;
            while(file.available()) {
                json += (char)file.read();
            }
            if (sendJsonToServer(json)) {
                deleteFile(SD, file.name());
            }
            file = root.openNextFile();
        }
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