using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Clientes;
using NailsApi.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Interfaces
{
    public interface IClienteService
    {
        Task<Result<PaginacionResponseDto<ClienteResponseDto>>> GetAllAsync(PaginacionDto paginacion);
        Task<Result<ClienteResponseDto>> GetByIdAsync(int id);
        Task<Result<IEnumerable<ClienteResponseDto>>> SearchAsync(string termino);
        Task<Result<ClienteResponseDto>> CreateAsync(ClienteRequestDto dto);
        Task<Result<ClienteResponseDto>> UpdateAsync(int id, ClienteRequestDto dto);
    }
}
