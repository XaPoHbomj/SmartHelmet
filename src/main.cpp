#include <Arduino.h>
#include "Gyroscope/Gyroscope.h"
//#include "SmokeDetector/SmokeDetector.h"
#include "Rangefinder/Rangefinder.h"
#include "WiFi.h"

const char* ssid = "Galaxy S20+9de1";
const char* password = "987654321";

char lineBuf[80];
int charCount = 0;
WiFiServer server(80);

auto gyroscope = Gyroscope();
//auto smokeDetector = SmokeDetector(1);
auto rangefinder = Rangefinder(16, 17);

void setup() {
    Serial.begin(9600);
    //smokeDetector.calibrate();

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to Wi-Fi..");
    }
    Serial.println("Connected to the Wi-Fi network");
    Serial.println("IP-address: ");
    Serial.println(WiFi.localIP());
    server.begin();
}

void loop() {
    auto axis = gyroscope.getAxis();

    Serial.println("Местоположение:");
    Serial.printf
    (
        "(%.2f, %.2f, %.2f)\n\n",
        axis.getX(),
        axis.getY(),
        axis.getZ()
    );

    //auto smokeValue = smokeDetector.read();

    //Serial.println("Задымленность:");
    //Serial.printf("%.2f\n\n", smokeValue);

    auto distance = rangefinder.read();

    Serial.println("Расстояние:");
    Serial.printf("%.2f\n\n", distance);

    delay(1000);





    WiFiClient client = server.available();
    if (client) {
        Serial.println("New client");
        memset(lineBuf, 0, sizeof(lineBuf));
        charCount = 0;
        // HTTP-запрос заканчивается пустой строкой
        boolean currentLineIsBlank = true;
        while (client.connected()) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: text/html");
            client.println("Connection: close");
            client.println();
            // формируем веб-страницу
            String webPage = "<!DOCTYPE HTML>";
            webPage += "<html>";
            webPage += "  <head>";
            webPage += "    <meta name=\"viewport\" content=\"width=device-width,";
            webPage += "    initial-scale=1\">";
            webPage += "  </head>";
            webPage += "  <h1>ESP32 - Web Server</h1>";
            webPage += "  <p>";
            webPage += "  	Местоположение: (";
            webPage += 		axis.getX();
            webPage +=      ", ";
            webPage +=      axis.getY();
            webPage +=      ", ";
            webPage +=      axis.getZ();
            webPage += ")   <br>";
            webPage += "  	Расстояние = ";
            webPage += 		distance;
            webPage += "	<br>";
            webPage += "  </p>";
            webPage += "</html>";
            client.println(webPage);
            break;
        }
        // даем веб-браузеру время для получения данных
        delay(1);
    }
}