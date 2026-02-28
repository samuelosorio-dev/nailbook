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

        public DbSet<Cliente> Clientes { get; set; }

    }
}
