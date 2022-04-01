#ifndef GYROSCOPEAXIS_H
#define GYROSCOPEAXIS_H

/* Представляет координаты по осям X, Y и Z */
struct GyroscopeAxis 
{
    private:
        /* Оси */
        double _x, _y, _z;
        
    public:
        /* Задает указанные оси для текущего экземпляра */
        GyroscopeAxis(double* gains);

        /* Получает координату по оси X */
        double getX();

        /* Получает координату по оси Y */
        double getY();

        /* Получает координату по оси Z */
        double getZ();
};

#endif