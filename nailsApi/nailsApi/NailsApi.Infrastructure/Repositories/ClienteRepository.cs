using Microsoft.EntityFrameworkCore;
using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Interfaces.Repositories;
using NailsApi.Infrastructure.Data;
using NailsApi.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Infrastructure.Repositories
{
    public class ClienteRepository:IClienteRepository
    {
        private readonly ApplicationDbContext _context;

        public ClienteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //Listar todos los clientes
        public async Task<List<Cliente>> GetAllAsync(PaginacionDto paginacion)
        {
            return await _context.Clientes
                .OrderBy(x => x.Nombre)
                .Paginar(paginacion)
                .ToListAsync();
        }

        public async Task<int> GetTotalAsync()
        {
            return await _context.Clientes.CountAsync();
        }

        //Buscar cliente por id
        public async Task<Cliente?> GetByIdAsync(int id)
        {
            return await _context.Clientes.FindAsync(id); //al poner findasync estamos contruyendo el where por la PK
        }

        //Crear cliente
        public async Task<Cliente> CreateAsync(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        //Buscar los clientes por nombre o telefono
        public async Task<IEnumerable<Cliente>> SearchAsync(string termino)
        {
            return await _context.Clientes
                .Where(x => x.Nombre.Contains(termino) ||
                            x.Telefono.Contains(termino))
                .ToListAsync();
        }

        //Actualizar clientes
        public async Task<Cliente> UpdateAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }
    }
}
