using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Servicios
{
    public class ServicioRequestDto
    {
        public string Nombre { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoServicio Tipo { get; set; }
        public int Duracion { get; set; }
    }
}
