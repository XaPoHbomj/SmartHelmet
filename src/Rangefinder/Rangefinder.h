#include "HCSR04.h"

class Rangefinder 
{
    private:
        HCSR04 _hcsr;

    public:
        Rangefinder(int outputPin, int echoPin);
        float read();
};