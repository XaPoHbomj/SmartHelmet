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
  return _fileSystem.mkdir(filepath);
}

bool SDCard::writeContent(const char* filepath, const char* content) 
{
    auto file = _fileSystem.open(filepath, FILE_WRITE);
    auto isWritten = file && file.print(content);

    file.close();

    return isWritten;
}

bool SDCard::deleteFile(const char* filepath) {
  return _fileSystem.remove(filepath);
}

File SDCard::open(const char* filepath) {
    return _fileSystem.open(filepath);
}

String& SDCard::read(File& file) {
    String content;
    
    while (file.available()) {
        content += (char)file.read();
    }

    return content;
}