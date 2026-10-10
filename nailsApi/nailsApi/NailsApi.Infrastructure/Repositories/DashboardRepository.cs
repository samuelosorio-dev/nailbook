using Microsoft.EntityFrameworkCore;
using NailsApi.Application.DTOs.Dashboard;
using NailsApi.Application.Interfaces.OutPorts;
using NailsApi.Domain.Enums;
using NailsApi.Domain.Interfaces.Repositories;
using NailsApi.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Infrastructure.Repositories
{
    public class DashboardRepository:IDashboardRepository
    {
        private readonly ApplicationDbContext _context;

        public DashboardRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetCitasHoyAsync()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            return await _context.Citas
                .CountAsync(c => c.Fecha == hoy);
        }

        public async Task<int> GetClientasActivasAsync()
        {
            return await _context.Citas
                .Where(c => c.Estado == EstadoCita.Finalizada)
                .Select(c => c.ClienteId)
                .Distinct()
                .CountAsync();
        }

        public async Task<decimal> GetIngresosHoyAsync()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            return await _context.Citas
                .Where(c => c.Fecha == hoy && c.Estado == EstadoCita.Finalizada)
                .SelectMany(c => c.CitaServicios)
                .SumAsync(cs => cs.Servicio.Valor);
        }

        public async Task<decimal> GetIngresosMesAsync()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            var inicioMes = new DateOnly(hoy.Year, hoy.Month, 1);
            var inicioMesSiguiente = inicioMes.AddMonths(1);

            return await _context.Citas
                .Where(c => c.Fecha >= inicioMes
                         && c.Fecha < inicioMesSiguiente
                         && c.Estado == EstadoCita.Finalizada)
                .SelectMany(c => c.CitaServicios)
                .SumAsync(cs => cs.Servicio.Valor);
        }

        public async Task<Dictionary<int, decimal>> GetGraficaMesAsync()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            var inicioMes = new DateOnly(hoy.Year, hoy.Month, 1);
            var inicioMesSiguiente = inicioMes.AddMonths(1);

            var datos = await _context.Citas
                .Where(c => c.Fecha >= inicioMes
                         && c.Fecha < inicioMesSiguiente
                         && c.Estado == EstadoCita.Finalizada)
                .Select(c => new
                {
                    Dia = c.Fecha.Day,
                    Total = c.CitaServicios.Sum(cs => cs.Servicio.Valor)
                })
                .GroupBy(c => c.Dia)
                .Select(g => new
                {
                    Dia = g.Key,
                    Total = g.Sum(c => c.Total)
                })
                .ToDictionaryAsync(x => x.Dia, x => x.Total);

            return datos;
        }

        public async Task<List<TopClientaDto>> GetTopClientasAsync(int top = 3)
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            var inicioAño = new DateOnly(hoy.Year, 1, 1);
            var inicioAñoSiguiente = inicioAño.AddYears(1);

            return await _context.Citas
                .Where(c => c.Fecha >= inicioAño
                         && c.Fecha < inicioAñoSiguiente
                         && c.Estado == EstadoCita.Finalizada)
                .GroupBy(c => new { c.ClienteId, c.Cliente.Nombre, c.Cliente.Alias })
                .Select(g => new TopClientaDto
                {
                    ClienteId = g.Key.ClienteId,
                    Nombre = g.Key.Nombre,
                    Alias = g.Key.Alias,
                    TotalCitas = g.Count(),
                    TotalIngresos = g.SelectMany(c => c.CitaServicios)
                                     .Sum(cs => cs.Servicio.Valor)
                })
                .OrderByDescending(x => x.TotalCitas)
                .ThenByDescending(x => x.TotalIngresos)
                .Take(top)
                .ToListAsync();
        }

    }
}
