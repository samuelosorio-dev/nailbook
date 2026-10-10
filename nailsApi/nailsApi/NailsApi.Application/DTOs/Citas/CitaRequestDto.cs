using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Citas
{
    public class CitaRequestDto
    {
        public int ClienteId { get; set; }
        public DateOnly Fecha { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public List<int> ServiciosIds { get; set; } = new();
    }
}
