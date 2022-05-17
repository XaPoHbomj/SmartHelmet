#ifndef SDCARD_H
#define SDCARD_H

#include "SD.h"
#include "FS.h"
#include "Thread.h"

class SDCard {
    public:
        SDCard();

        /* Пытается инициализировать SD карту и определяет ее доступность */
        bool trySetupSecureDigitalCard();

        /* Создаёт директорию по указанному пути */
        void createDir(fs::FS &fs, const char * path);

        /* Создаёт новый файл и записывает в него сообщение */
        void writeFile(fs::FS &fs, const char * path, const char * message);

        /* Удаляет файл по указанному пути */
        void deleteFile(fs::FS &fs, const char * path);

        /* Создаёт файл и записывает в него json */
        void printJsonToFile(String &json);

        /* Потоко проверки файлов на отправку на сервер */
        Thread CheckFiles = Thread();
};

#endif