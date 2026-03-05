using Mapster;
using NailsApi.Application.DTOs.Citas;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Mappings
{
    public class CitaMappingConfig:IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Cita, CitaResponseDto>()
                .Map(dest => dest.ClienteNombre, org => org.Cliente.Nombre)
                .Map(dest => dest.Servicios, org => org.CitaServicios
                    .Select(cs => new CitaServicioDto
                    {
                        Id = cs.Servicio.Id,
                        Nombre = cs.Servicio.Nombre,
                        Tipo=cs.Servicio.Tipo,
                        Valor = cs.Servicio.Valor,
                        Duracion = cs.Servicio.Duracion
                    }).ToList());
        }
    }
}
