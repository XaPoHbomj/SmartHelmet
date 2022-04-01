using WebServer.Sensors;

namespace WebServer.Events;

/// <summary>
/// Представляет событие, получаемое при изменении показаний датчиков на плате
/// </summary>
public class ReceiveSensorValuesEvent : EventBase
{
    /// <summary>
    /// Значение датчика расстояния
    /// </summary>
    public float Distance { get; set; }

    /// <summary>
    /// Значение датчика дыма
    /// </summary>
    public float SmokeValue { get; set; }
    
    /// <summary>
    /// Значения, полученные с гироскопа
    /// </summary>
    public GyroscopeValues Gyroscope { get; set; }
}