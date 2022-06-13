#ifndef API_H
#define API_H

#include <Arduino.h>

/* Фасад для обращения к Api */
class Api 
{
    private:
        /* Путь к Api */
        String _baseUrl;

        /* 
            Вызывает указанный метод на сервере 
            methodName - имена метода на удаленном сервере 
            arguments - аргументы метода в формате JSON
        */
        bool call(const char* methodName, String& arguments);

	public:
		/* Инициализирует Api */
		Api(const char* baseUrl);

        /*
            Отправляет события с показаниями платы на сервер
        */
        bool sendEvent(String& json);
};

#endif