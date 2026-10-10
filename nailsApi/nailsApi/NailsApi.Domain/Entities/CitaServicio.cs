using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Entities
{
    public class CitaServicio
    {
        public int CitaId { get; set; }
        public Cita Cita { get; set; } = null!;
        public int ServicioId { get; set; }
        public Servicio Servicio { get; set; } = null!;
    }
}
