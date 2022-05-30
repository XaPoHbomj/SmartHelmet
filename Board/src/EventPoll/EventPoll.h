#ifndef EVENTSTORAGE_H
#define EVENTSTORAGE_H

#include <SD.h>
#include <FS.h>

/* Представляет пул событий */
class EventPoll {
    private:
        /* Папка для сохранения событий на SD-карте */
        String _folder;

    public:
        /* 
           Инициализирует пул событий
           folder - папка для сохранения событий на SD-карте 
        */
        EventPoll(const char* folder);

        /* Подготавливает пул событий к работе */
        bool trySetup();

        /* Сохраняет событие в формате Json */
        bool saveEvent(unsigned long timestamp, String& json);

        /* Возвращает ссылку на директорию с событиями */
        File getSource();

        /* Удаляет указанный файл с событием */
        bool removeEvent(File eventFile);
};

#endif