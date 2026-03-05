using Mapster;
using NailsApi.Application.DTOs.Servicios;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Mappings
{
    public class ServicioMappingConfig:IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ServicioRequestDto, Servicio>();
            config.NewConfig<Servicio, ServicioResponseDto>();
        }
    }
}
