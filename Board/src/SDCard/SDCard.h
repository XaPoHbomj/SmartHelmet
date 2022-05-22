#ifndef SDCARD_H
#define SDCARD_H

#include "SD.h"
#include "FS.h"
#include "Thread.h"

/* Фасад для работы с SD картой */
class SDCard {
    private:
        fs::FS& _fileSystem;

    public:
        /* Инициализирует файловую систему */
        SDCard(fs::FS& fileSystem);

        /* Пытается инициализировать SD карту и определяет ее доступность */
        bool trySetupSecureDigitalCard();

        /* Создаёт директорию по указанному пути */
        bool createDirectory(const char* filepath);

        /* Создаёт новый файл и записывает в него текстовый данные */
        bool writeContent(const char* filepath, const char* content);

        /* Удаляет файл по указанному пути */
        bool deleteFile(const char* filepath);

        /* Открывает первый файл в папке */
        File open(const char* filepath);

        /* Возвращает содержимое файла */
        String& read(File& file);
};

#endif