var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddControllers();

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

application.Run();