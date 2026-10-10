using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Dashboard
{
    public class DashboardResumenDto
    {
        public int CitasHoy { get; set; }
        public int ClientasActivas { get; set; }
        public decimal IngresosHoy { get; set; }
        public decimal IngresosMes { get; set; }
        public List<IngresosDiaDto> GraficaMes { get; set; } = new();
    }

    public class IngresosDiaDto
    {
        public int Dia { get; set; }
        public decimal Total { get; set; }
    }
}
