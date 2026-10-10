using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Interfaces.Repositories
{
    public interface IServicioRepository
    {
        Task<List<Servicio>> GetAllAsync();
        Task<int> GetTotalAsync();
        Task<Servicio?> GetByIdAsync(int id);
        Task<Servicio?> GetByNombreAsync(string nombre);
        Task<Servicio> CreateAsync(Servicio servicio);
        Task<Servicio> UpdateAsync(Servicio servicio);
    }
}
