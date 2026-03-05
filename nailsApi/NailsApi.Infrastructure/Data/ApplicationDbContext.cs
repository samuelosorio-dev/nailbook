using Microsoft.EntityFrameworkCore;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Servicio>()
                .Property(s => s.Valor)
                .HasPrecision(10, 2);

            modelBuilder.Entity<CitaServicio>()
            .HasKey(cs => new { cs.CitaId, cs.ServicioId });
        }

        public DbSet<Cliente> Clientes { get; set; } 
        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<CitaServicio> CitaServicios { get; set; }

    }
}
