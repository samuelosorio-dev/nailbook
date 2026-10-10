using NailsApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NailsApi.Domain.Interfaces.Repositories;
using NailsApi.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Infrastructure.Repositories
{
    public class ServicioRepository:IServicioRepository
    {
        private readonly ApplicationDbContext _context;

        public ServicioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Servicio>> GetAllAsync()
        {
            return await _context.Servicios
                .OrderBy(x => x.Nombre)
                .ToListAsync();
        }

        public async Task<int> GetTotalAsync()
        {
            return await _context.Servicios.CountAsync();
        }

        public async Task<Servicio?> GetByIdAsync(int id)
        {
            return await _context.Servicios.FindAsync(id);
        }

        public async Task<Servicio?> GetByNombreAsync(string nombre)
        {
            return await _context.Servicios
                .FirstOrDefaultAsync(x => x.Nombre.ToLower() == nombre.ToLower());
        }

        public async Task<Servicio> CreateAsync(Servicio servicio)
        {
            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();
            return servicio;
        }

        public async Task<Servicio> UpdateAsync(Servicio servicio)
        {
            _context.Servicios.Update(servicio);
            await _context.SaveChangesAsync();
            return servicio;
        }
    }
}
