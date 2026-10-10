using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Common
{
    public class PaginacionDto
    {
        public int Pagina { get; set; } = 1;
        private int recordsPorPagina = 5;
        private readonly int cantidadMaxima = 50;

        public int RecordsPorPagina
        {
            get => recordsPorPagina;
            set => recordsPorPagina = value > cantidadMaxima ? cantidadMaxima : value;
        }
    }
}
