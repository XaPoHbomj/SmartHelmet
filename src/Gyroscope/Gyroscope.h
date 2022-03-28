#include "SparkFun_ADXL345.h"
#include "GyroscopeAxis.h"

/* Фасад для ADXL345 */
class Gyroscope 
{
	private:
		/* Датчик */
		ADXL345 _adxl;

	public:
		/* Инициализирует гироскоп */
		Gyroscope();
		
		/* Получает координаты по осям */
		GyroscopeAxis getAxis();
};