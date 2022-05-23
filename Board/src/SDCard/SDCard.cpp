#include "SDCard.h"

// TODO: Вырезать Serial из этого метода
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
  return SD.mkdir(filepath);
}

bool SDCard::writeContent(const char* filepath, const char* content) 
{
    auto file = SD.open(filepath, FILE_WRITE, true);
    auto isWritten = file && file.print(content);
    file.close();

    return isWritten;
}

bool SDCard::deleteFile(const char* filepath) {
  return SD.remove(filepath);
}

File SDCard::open(const char* filepath) {
    return SD.open(filepath, FILE_READ, true);
}

String SDCard::read(File& file) {
    return file.readString();
}