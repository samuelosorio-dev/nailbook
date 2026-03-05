using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Entities
{
    public class Servicio
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoServicio Tipo { get; set; }
        public int Duracion { get; set; }
    }
}
