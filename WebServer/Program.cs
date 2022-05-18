using WebServer.Hubs;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddControllers();
services.AddSignalR();

services.AddCors(options =>
{
    options.AddPolicy("Dashboard", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:3000")
              .AllowCredentials();
    });
});

services.AddEndpointsApiExplorer()
        .AddSwaggerGen();

var application = builder.Build();
var environment = application.Environment;

if (environment.IsDevelopment())
{
    application.UseSwagger()
               .UseSwaggerUI();
}

application.UseHttpsRedirection()
           .UseAuthorization();

application.MapControllers();
application.MapHub<BoardHub>("board");
application.UseCors("Dashboard");

application.Run();