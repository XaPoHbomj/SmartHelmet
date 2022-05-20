#include "SDCard.h"

bool SDCard::trySetupSecureDigitalCard() 
{
    if (!SD.begin())
    {
        Serial.println("SD Card mount failed");

        return false;
    }

    auto cardType = SD.cardType();

    if (cardType == CARD_NONE || cardType == CARD_UNKNOWN)
    {
        Serial.println("SD Card is missing");

        return false;
    }

    Serial.printf("SD Card Type: %d\n", cardType);
    auto mibs = 1024 * 1024;

    Serial.printf
    (
        "SD Card size: %llu MiB\n", 
        SD.cardSize() / mibs
    );

    Serial.printf
    (
        "Total space: %llu MiB\n", 
        SD.totalBytes() / mibs
    );

    Serial.printf
    (
        "Used space: %llu MiB\n", 
        SD.usedBytes() / mibs
    );

    return true;
}

bool SDCard::createDirectory(const char* filepath) {
  return _fileSystem.mkdir(filepath);
}

void SDCard::writeContent(const char* filepath, const char* content) 
{
    auto file = _fileSystem.open(filepath, FILE_WRITE);

    if(!file) 
    {
        Serial.println("Failed to open file for writing");
        return;
    }

    if(file.print(content))
    {
        Serial.println("File written");
    } 
    else 
    {
        Serial.println("Write failed");
    }

    file.close();
}

bool SDCard::deleteFile(const char * filepath) {
  return _fileSystem.remove(filepath);
}

void SDCard::writeJson(String &json, String& filename) {
    auto path = "/DATA/" + filename + ".txt";

    writeContent(
        path.c_str(), 
        json.c_str()
    );
}