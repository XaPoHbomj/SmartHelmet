#ifndef IMPACTSENSOR_H
#define IMPACTSENSOR_H

#include <Arduino.h>
#include "../AnalogSensor.h"

/* Представляет датчик удара */
class ImpactSensor : public AnalogSensor
{
    private:
        /* Занятый датчиком удара контакт на плате */
        int _pin;

    public:
        /* Инициализирует датчик удара */
        ImpactSensor(int pin);

        /* Производит калибровку датчика удара */
        bool isImpacted();

        /* Считывает значение датчика удара */
        virtual float read() override;
};

#endif