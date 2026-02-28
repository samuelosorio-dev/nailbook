using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Domain.Interfaces.Repositories
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAllAsync(PaginacionDto paginacion);
        Task<int> GetTotalAsync();
        Task<Cliente?> GetByIdAsync(int id);
        //Task<Cliente?> GetByTelefonoAsync(string telefono);
        Task<IEnumerable<Cliente>> SearchAsync(string termino);
        Task<Cliente> CreateAsync(Cliente cliente);
        Task<Cliente> UpdateAsync(Cliente cliente);
    }
}
