using FluentValidation;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using NailsApi.Application.DTOs.Clientes;
using NailsApi.Application.Interfaces;
using NailsApi.Application.Services;
using NailsApi.Application.Validators;
using NailsApi.Domain.Interfaces.Repositories;
using NailsApi.Infrastructure.Data;
using NailsApi.Infrastructure.Repositories;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();

// Servicios
builder.Services.AddScoped<IClienteService, ClienteService>();

// FluentValidation
builder.Services.AddScoped<IValidator<ClienteRequestDto>, ClienteValidator>();

// Mapster
var config = TypeAdapterConfig.GlobalSettings;
config.Scan(Assembly.GetAssembly(typeof(ClienteService))!);
builder.Services.AddSingleton(config);
builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddOutputCache(opciones => {
    opciones.DefaultExpirationTimeSpan=TimeSpan.FromSeconds(60);
});

builder.Services.AddCors(opciones => {
    opciones.AddDefaultPolicy(opcionesCORS =>
    {
        opcionesCORS.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();
