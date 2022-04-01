namespace WebServer.Events;

/// <summary>
/// Представляет стандартное событие, получаемое от платы
/// </summary>
public abstract class EventBase
{
    /// <summary>
    /// Дата и время получения события
    /// </summary>
    public DateTime DateTime { get; set; }
    
    /// <summary>
    /// Уровень заряда платы
    /// </summary>
    public float BatteryLevel { get; set; }
    
    /// <summary>
    /// Уровень сигнала Wi-Fi
    /// </summary>
    public int SignalLevel { get; set; }
}