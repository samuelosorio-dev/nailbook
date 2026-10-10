using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Dashboard
{
    public class TopClientaDto
    {
        public int ClienteId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Alias { get; set; }
        public int TotalCitas { get; set; }
        public decimal TotalIngresos { get; set; }
    }
}
