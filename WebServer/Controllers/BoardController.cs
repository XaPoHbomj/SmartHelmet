using Microsoft.AspNetCore.Mvc;
using WebServer.Events;

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
    /// Инициализирует <see cref="BoardController"/>
    /// </summary>
    /// <param name="logger">Логгер</param>
    public BoardController(ILogger<BoardController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Принимает значения сенсоров
    /// </summary>
    /// <param name="event">Событие, содержащее значения сенсоров</param>
    [HttpPost]
    [Route("ReceiveSensorsData")]
    public IActionResult OnSensorsDataChanged([FromBody] SensorsDataChangedEvent @event)
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


        
        return Ok();
    }
}