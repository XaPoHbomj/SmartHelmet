#include "HCSR04.h"

/* Фасад для HCSR04 */
class Rangefinder 
{
    private:
        /* Датчик */
        HCSR04 _hcsr;

    public:
        /* Инициализирует измеритель расстояния */
        Rangefinder(int outputPin, int echoPin);

        /* Возвращает расстояние до предмета в поле зрения датчика */
        float read();
};