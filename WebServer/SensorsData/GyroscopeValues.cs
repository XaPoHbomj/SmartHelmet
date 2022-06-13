namespace WebServer.SensorsData;

/// <summary>
/// Представляет класс, хранящий информацию о гироскопе
/// </summary>
public class GyroscopeValues
{
    /// <summary>
    /// Значение по оси X
    /// </summary>
    public float X { get; set; }
    
    /// <summary>
    /// Значение по оси Y
    /// </summary>
    public float Y { get; set; }
  
    /// <summary>
    /// Значение по оси Z
    /// </summary>
    public float Z { get; set; }
}