#include "Api.h"
#include <HTTPClient.h>

Api::Api(String& baseUrl)
{
    _baseUrl = baseUrl;
}

bool Api::call(String& methodName, String& arguments) 
{
    HTTPClient httpClient;
    auto isConnected = httpClient.begin(_baseUrl + methodName);

    if (!isConnected) 
    {
        Serial.printf("Не удалось подключиться к %s\n", _baseUrl);
        return false;
    }

    httpClient.addHeader("Content-Type", "application/json");
    auto responseCode = httpClient.POST(arguments);
    auto isSuccess = responseCode >= 200 && responseCode < 300;

    httpClient.end();

    auto message = isSuccess 
                 ? "Запрос успешно отправлен" 
                 : "Не удалось отправить запрос";
                 
    Serial.println(message);

    return isSuccess;
}