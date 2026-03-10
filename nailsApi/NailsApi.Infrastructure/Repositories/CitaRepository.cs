using Microsoft.EntityFrameworkCore;
using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Enums;
using NailsApi.Domain.Interfaces.Repositories;
using NailsApi.Infrastructure.Data;
using NailsApi.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Infrastructure.Repositories
{
    public class CitaRepository:ICitaRepository
    {
        private readonly ApplicationDbContext _context;

        public CitaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private IQueryable<Cita> GetCitasQuery(EstadoCita? estado = null)
        {
            var hoy = DateOnly.FromDateTime(DateTime.Today);
            var inicioMes = new DateOnly(hoy.Year, hoy.Month, 1);
            var inicioMesSiguiente = inicioMes.AddMonths(1);

            var query = _context.Citas
                .Include(c => c.Cliente)
                .Include(c => c.CitaServicios)
                .ThenInclude(cs => cs.Servicio)
                .Where(c => c.Fecha >= inicioMes && c.Fecha < inicioMesSiguiente)
                .AsQueryable();

            if (estado.HasValue)
                query = query.Where(c => c.Estado == estado.Value);


            return query;
        }

        public async Task<List<Cita>> GetAllAsync(PaginacionDto paginacion, EstadoCita? estado = null)
        {
            return await GetCitasQuery(estado)
                .OrderBy(c => c.Fecha)
                .ThenBy(c => c.HoraInicio)
                .Paginar(paginacion)
                .ToListAsync();
        }

        public async Task<int> GetTotalAsync(EstadoCita? estado = null)
        {
            return await GetCitasQuery(estado).CountAsync();
        }

        public async Task<Cita?> GetByIdAsync(int id)
        {
            return await _context.Citas
                .Include(c => c.Cliente)
                .Include(c => c.CitaServicios)
                    .ThenInclude(cs => cs.Servicio)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Cita> CreateAsync(Cita cita)
        {
            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();
            return cita;
        }

        public async Task<Cita> UpdateAsync(Cita cita)
        {
            var serviciosAnteriores = await _context.CitaServicios
                .Where(cs => cs.CitaId == cita.Id)
                .ToListAsync();
                    _context.CitaServicios.RemoveRange(serviciosAnteriores);

            _context.Citas.Update(cita);
            await _context.SaveChangesAsync();
            return cita;
        }
        public async Task<Cita> UpdateEstadoAsync(Cita cita)
        {
            _context.Citas.Update(cita);
            await _context.SaveChangesAsync();
            return cita;
        }

    }
}
