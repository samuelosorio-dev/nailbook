using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<Result<DashboardResumenDto>> GetResumenAsync();
        Task<Result<List<TopClientaDto>>> GetTopClientasAsync();
    }
}
