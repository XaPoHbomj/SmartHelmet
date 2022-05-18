namespace WebServer.Events;

/// <summary>
/// Представляет стандартное событие, получаемое от платы
/// </summary>
public abstract class EventBase
{
    /// <summary>
    /// Идентификатор платы
    /// </summary>
    public string BoardIdentificator { get; set; }

    /// <summary>
    /// Дата и время получения события
    /// </summary>
    public DateTimeOffset DateTime { get; set; }
    
    /// <summary>
    /// Уровень заряда платы
    /// </summary>
    public float BatteryLevel { get; set; }
    
    /// <summary>
    /// Уровень сигнала Wi-Fi
    /// </summary>
    public int SignalLevel { get; set; }
}