using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Common
{
    public class PaginacionResponseDto<T>
    {
        public List<T> Data { get; set; } = new(); // Data = [] lista vacía por defecto, así inicializo el new List<T>
        public int TotalRegistros { get; set; }
        public int TotalPaginas { get; set; }
        public int PaginaActual { get; set; }
    }
}
