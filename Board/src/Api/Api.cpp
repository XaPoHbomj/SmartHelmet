#include "Api.h"
#include <HTTPClient.h>

Api::Api(const char* baseUrl)
{
    _baseUrl = baseUrl;
}

bool Api::call(const char* methodName, String& arguments) 
{
    HTTPClient httpClient;
    auto isConnected = httpClient.begin(_baseUrl + methodName);
    httpClient.addHeader("Content-Type", "application/json");

    if (!isConnected) 
    {
        Serial.printf("Не удалось подключиться к %s\n", _baseUrl);

        return false;
    }

    auto responseCode = httpClient.POST(arguments);
    auto isSuccess = responseCode >= 200 && responseCode < 300;

    if (!isSuccess)
    {
        Serial.printf("Не удалось отправить запрос [Код ошибки: %d]\n", responseCode);
    }

    httpClient.end();

    return isSuccess;
}

bool Api::sendEvent(String& json) 
{
    return call("ReceiveSensorsData", json);
}