using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Citas
{
    public class CitaServicioDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public TipoServicio Tipo { get; set; }
        public decimal Valor { get; set; }
        public int Duracion { get; set; }
    }
}
