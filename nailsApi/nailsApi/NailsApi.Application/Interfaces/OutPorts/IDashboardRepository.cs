using NailsApi.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Interfaces.OutPorts
{
    public interface IDashboardRepository
    {
        Task<int> GetCitasHoyAsync();
        Task<int> GetClientasActivasAsync();
        Task<decimal> GetIngresosHoyAsync();
        Task<decimal> GetIngresosMesAsync();
        Task<Dictionary<int, decimal>> GetGraficaMesAsync(); // ← dia, total
        Task<List<TopClientaDto>> GetTopClientasAsync(int top = 3);
    }
}
