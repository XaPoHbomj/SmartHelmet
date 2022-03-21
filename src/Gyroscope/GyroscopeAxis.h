struct GyroscopeAxis 
{
    private:
        double _x, _y, _z;
        
    public:
        GyroscopeAxis(double* gains);
        double getX();
        double getY();
        double getZ();
};