#include <Wire.h>
#include "Arduino.h"
#include "Gyroscope.h"

Gyroscope::Gyroscope()
    : _adxl(
        ADXL345()
    )
{
    _adxl.powerOn();
    _adxl.setRangeSetting(8); 
}

GyroscopeAxis Gyroscope::getAxis() 
{
	auto axis = new double[3];
	_adxl.get_Gxyz(axis);
	return GyroscopeAxis(axis);
}