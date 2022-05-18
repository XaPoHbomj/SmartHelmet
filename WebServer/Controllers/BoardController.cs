using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebServer.Events;
using WebServer.Hubs;

namespace WebServer.Controllers;

/// <summary>
/// Контроллер, принимающий HTTP-запросы с платы
/// </summary>
[ApiController]
[Route("[controller]")]
public class BoardController : ControllerBase
{
    /// <summary>
    /// Логгер
    /// </summary>
    private readonly ILogger<BoardController> _logger;

    /// <summary>
    /// Контект для <see cref="BoardHub"/>
    /// </summary>
    private readonly IHubContext<BoardHub> _hubContext;

    /// <summary>
    /// Инициализирует <see cref="BoardController"/>
    /// </summary>
    /// <param name="logger">Логгер</param>
    /// <param name="hubContext">Контект для <see cref="BoardHub"/></param>
    public BoardController(ILogger<BoardController> logger, IHubContext<BoardHub> hubContext)
    {
        _logger = logger;
        _hubContext = hubContext;
    }

    /// <summary>
    /// Принимает значения сенсоров
    /// </summary>
    /// <param name="event">Событие, содержащее значения сенсоров</param>
    [HttpPost]
    [Route("ReceiveSensorsData")]
    public async Task<IActionResult> OnSensorsDataChanged([FromBody] SensorsDataChangedEvent @event)
    {
        if (@event is null)
        {
            if (_logger.IsEnabled(LogLevel.Error))
            {
                _logger.LogError("Не удалось получить событие");
            }
            
            return BadRequest();
        }

        if (_logger.IsEnabled(LogLevel.Information))
        {
            _logger.LogInformation
            (
                "Событие \"{EventType}\" получено с платы", 
                @event.GetType()
            );
        }

        await _hubContext.Clients.All.SendAsync("getUpdates", @event);
        
        return Ok();
    }
}