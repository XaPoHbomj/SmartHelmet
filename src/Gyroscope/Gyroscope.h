#include "SparkFun_ADXL345.h"
#include "GyroscopeAxis.h"

class Gyroscope 
{
	private:
		ADXL345 _adxl;

	public:
		Gyroscope();
		GyroscopeAxis getAxis();
};