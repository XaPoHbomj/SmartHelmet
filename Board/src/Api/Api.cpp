#include "Api.h"
#include <HTTPClient.h>

Api::Api(const char* baseUrl)
{
    _baseUrl = baseUrl;
}

bool Api::call(const char* methodName, const char* arguments) 
{
    HTTPClient httpClient;
    auto isConnected = httpClient.begin(_baseUrl + methodName);
    httpClient.addHeader("Content-Type", "application/json");

    if (!isConnected) 
    {
        Serial.printf("Не удалось подключиться к %s\n", _baseUrl);

        return false;
    }

Serial.println(arguments);
    auto responseCode = httpClient.POST(arguments);
    auto isSuccess = responseCode >= 200 && responseCode < 300;
    Serial.println(responseCode);

    if (!isSuccess)
    {
        Serial.println("Не удалось отправить запрос");
    }

    httpClient.end();

    return isSuccess;
}

bool Api::sendSensorsData(String& json) 
{
    return call(
        "ReceiveSensorsData", 
        json.c_str()
    );
}