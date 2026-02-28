using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Entities
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Alias { get; set; }
        public string Telefono { get; set; } = string.Empty;
    }
}
