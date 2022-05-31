#include "ImpactSensor.h"

ImpactSensor::ImpactSensor(int pin)
    : _pin(pin)
{ 
    pinMode(pin, INPUT);
}

bool ImpactSensor::isImpacted() 
{
    return read() > 100;
}

float ImpactSensor::read() 
{
    return (float)analogRead(_pin);
}