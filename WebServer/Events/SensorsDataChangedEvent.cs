using WebServer.SensorsData;

namespace WebServer.Events;

/// <summary>
/// Представляет событие, получаемое при изменении показаний датчиков на плате
/// </summary>
public class SensorsDataChangedEvent : EventBase
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

    /// <summary>
    /// По датчику расстояния определяет снята ли каска
    /// </summary>
    public bool IsDismounted => Distance < 5.0f;
    
    /// <summary>
    /// По датчику дыма определяет высокий ли уровень задымления вокруг платы
    /// </summary>
    public bool IsHighSmokeLevel => SmokeValue > 1000.0f;

    /// <summary>
    /// Определяет заряжается ли каска
    /// </summary>
    public bool Charging { get; set; }
    
    /// <summary>
    /// Определяет упала ли каска
    /// </summary>
    public bool IsFellOff { get; set; }
}