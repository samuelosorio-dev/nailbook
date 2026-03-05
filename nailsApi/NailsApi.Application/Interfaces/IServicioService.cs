using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Servicios;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Interfaces
{
    public interface IServicioService
    {
        Task<Result<List<ServicioResponseDto>>> GetAllAsync();
        Task<Result<ServicioResponseDto>> GetByIdAsync(int id);
        Task<Result<ServicioResponseDto>> CreateAsync(ServicioRequestDto dto);
        Task<Result<ServicioResponseDto>> UpdateAsync(int id, ServicioRequestDto dto);
    }
}
