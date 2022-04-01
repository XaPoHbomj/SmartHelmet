#ifndef RANGEFINDER_H
#define RANGEFINDER_H

#include "HCSR04.h"
#include "../AnalogSensor.h"

/* Фасад для HCSR04 */
class Rangefinder : public AnalogSensor
{
    private:
        /* Датчик */
        HCSR04 _hcsr;

    public:
        /* Инициализирует измеритель расстояния */
        Rangefinder(int outputPin, int echoPin);

        /* Возвращает расстояние до предмета в поле зрения датчика */
        virtual float read() override;
};

#endif