#ifndef API_H
#define API_H

#include <Arduino.h>

/* Фасад для обращения к Api */
class Api 
{
    private:
        String _baseUrl;

	public:
		/* Инициализирует Api */
		Api(String& baseUrl);

        /* 
            Вызывает указанный метод на сервере 
            methodName - имена метода на удаленном сервере 
            arguments - аргументы метода в формате JSON
        */
        bool call(String& methodName, String& arguments);
};

#endif