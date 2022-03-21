#include <Arduino.h>

class SmokeDetector
{
    private:
        int _pin;

    public:
        SmokeDetector(int pin);
        void calibrate();
        float read();
};