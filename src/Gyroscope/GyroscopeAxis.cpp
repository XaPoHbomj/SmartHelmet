#include "GyroscopeAxis.h"

GyroscopeAxis::GyroscopeAxis(double* gains) 
{
    _x = gains[0];
    _y = gains[1];
    _z = gains[2];
}
    
double GyroscopeAxis::getX()
{
    return _x;
}
        
double GyroscopeAxis::getY() 
{
    return _y;
}
        
double GyroscopeAxis::getZ() 
{
    return _z;
}