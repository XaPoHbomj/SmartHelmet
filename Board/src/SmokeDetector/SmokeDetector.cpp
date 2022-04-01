#include "SmokeDetector.h"

SmokeDetector::SmokeDetector(int pin)
    : _pin(pin)
{ 
    pinMode(pin, INPUT);
}

void SmokeDetector::calibrate() 
{
    // Type code here...
}

float SmokeDetector::read() 
{
    return (float)analogRead(_pin);
}