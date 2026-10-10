using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Dashboard;
using NailsApi.Application.Interfaces;
using NailsApi.Application.Interfaces.OutPorts;
using NailsApi.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Services
{
    public class DashboardService:IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<Result<DashboardResumenDto>> GetResumenAsync()
        {
            var citasHoy = await _dashboardRepository.GetCitasHoyAsync();
            var clientasActivas = await _dashboardRepository.GetClientasActivasAsync();
            var ingresosHoy = await _dashboardRepository.GetIngresosHoyAsync();
            var ingresosMes = await _dashboardRepository.GetIngresosMesAsync();
            var graficaMes = await _dashboardRepository.GetGraficaMesAsync();

            var resumen = new DashboardResumenDto
            {
                CitasHoy = citasHoy,
                ClientasActivas = clientasActivas,
                IngresosHoy = ingresosHoy,
                IngresosMes = ingresosMes,
                GraficaMes = graficaMes
                    .Select(kvp => new IngresosDiaDto
                    {
                        Dia = kvp.Key,
                        Total = kvp.Value
                    })
                    .OrderBy(x => x.Dia)
                    .ToList()
            };

            return Result<DashboardResumenDto>.Success(resumen);
        }

        public async Task<Result<List<TopClientaDto>>> GetTopClientasAsync()
        {
            var top = await _dashboardRepository.GetTopClientasAsync(3);

            var resultado = top.Select(x => new TopClientaDto
            {
                ClienteId = x.ClienteId,
                Nombre = x.Nombre,
                Alias = x.Alias,
                TotalCitas = x.TotalCitas,
                TotalIngresos = x.TotalIngresos
            }).ToList();

            return Result<List<TopClientaDto>>.Success(resultado);
        }
    }

}
