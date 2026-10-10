using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Entities
{
    public class Cita
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; } = null!;
        public DateOnly Fecha { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
        public int Duracion { get; set; }
        public EstadoCita Estado { get; set; } = EstadoCita.Programada;
        public ICollection<CitaServicio> CitaServicios { get; set; } = new List<CitaServicio>();
    }
}
