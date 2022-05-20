#include "SDCard.h"

bool trySetupSecureDigitalCard() 
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

void createDir(fs::FS &fs, const char * path) {
  Serial.printf("Creating Dir: %s\n", path);
  if(fs.mkdir(path)){
    Serial.println("Dir created");
  } else {
    Serial.println("mkdir failed");
  }
}

void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if(!file){
    Serial.println("Failed to open file for writing");
    return;
  }
  if(file.print(message)){
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  file.close();
}

void deleteFile(fs::FS &fs, const char * path) {
  Serial.printf("Deleting file: %s\n", path);
  if(fs.remove(path)){
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}

void printJsonToFile(String &json, String &time) {
    String path = "/DATA/" + time + ".txt";
    writeFile(SD, path.c_str(), json.c_str());
}