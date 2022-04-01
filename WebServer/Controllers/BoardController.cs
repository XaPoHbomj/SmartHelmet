using Microsoft.AspNetCore.Mvc;

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
}