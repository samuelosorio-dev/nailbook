using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.DTOs.Clientes
{
    public class ClienteResponseDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Alias { get; set; }
        public string Telefono { get; set; } = string.Empty;
    }
}
