#include "Rangefinder.h"

Rangefinder::Rangefinder(int outputPin, int echoPin) 
    : _hcsr(
        HCSR04(outputPin, echoPin)
    )
{ }

float Rangefinder::read() 
{
    return _hcsr.dist();
}