using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Citas
{
    public class CitaResponseDto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string ClienteNombre { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
        public int Duracion { get; set; }
        public EstadoCita Estado { get; set; }
        public List<CitaServicioDto> Servicios { get; set; } = new();
    }
}
