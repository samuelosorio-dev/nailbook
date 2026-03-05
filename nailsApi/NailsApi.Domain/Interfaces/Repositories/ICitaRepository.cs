using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Interfaces.Repositories
{
    public interface ICitaRepository
    {
        Task<List<Cita>> GetAllAsync(PaginacionDto paginacion, EstadoCita? estado = null);
        Task<int> GetTotalAsync(EstadoCita? estado = null);
        Task<Cita?> GetByIdAsync(int id);
        Task<Cita> CreateAsync(Cita cita);
        Task<Cita> UpdateAsync(Cita cita);
        Task<Cita> UpdateEstadoAsync(Cita cita);
    }
}
