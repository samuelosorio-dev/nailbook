using Mapster;
using NailsApi.Application.DTOs.Clientes;
using NailsApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Mappings
{
    public class ClienteMappingConfig:IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ClienteRequestDto, Cliente>();
            config.NewConfig<Cliente, ClienteResponseDto>();
        }
    }
}
