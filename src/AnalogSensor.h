#ifndef ANALOGSENSOR_H
#define ANALOGSENSOR_H

/* Представляет простой аналоговый датчик */
class AnalogSensor {
    public:
        /* Считывает данные с датчика */
        virtual float read() = 0;
};

#endif