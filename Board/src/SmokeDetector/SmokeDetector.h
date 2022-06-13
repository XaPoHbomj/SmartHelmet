#ifndef SMOKEDETECTOR_H
#define SMOKEDETECTOR_H

#include <Arduino.h>
#include "../AnalogSensor.h"

/* Представляет датчика дыма */
class SmokeDetector : public AnalogSensor
{
    private:
        /* Занятый датчиком дыма контакт на плате */
        int _pin;

    public:
        /* Инициализирует датчик дыма */
        SmokeDetector(int pin);

        /* Производит калибровку датчика дыма */
        void calibrate();

        /* Считывает уровень задымления вокруг датчика */
        virtual float read() override;
};

#endif