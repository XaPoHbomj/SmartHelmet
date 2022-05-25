#include "EventPoll.h"

EventPoll::EventPoll(const char* folder) 
{
    _folder = folder;
}

bool EventPoll::trySetup() 
{
    if (!SD.begin())
    {
        return false;
    }

    auto cardType = SD.cardType();

    if (cardType == CARD_NONE || cardType == CARD_UNKNOWN) 
    {
        return false;
    }

    return SD.mkdir(_folder);
}

bool EventPoll::saveEvent(unsigned long timestamp, String& json) 
{
    auto filename = _folder + "/" + timestamp + ".txt";
    auto file = SD.open(filename, FILE_WRITE);
    auto isCreated = file && file.print(json);
    
    file.close();
    
    return isCreated;
}

File EventPoll::getNextEventFile() 
{
    auto directory = SD.open(_folder, FILE_READ);
    return directory.openNextFile();
}

bool EventPoll::removeEvent(File eventFile)
{
    auto filepath = _folder + "/" + eventFile.name();
    return SD.remove(filepath);
}