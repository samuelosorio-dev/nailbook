using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Citas;
using NailsApi.Domain.Common;
using NailsApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Interfaces
{
    public interface ICitaService
    {
        Task<Result<PaginacionResponseDto<CitaResponseDto>>> GetAllAsync(PaginacionDto paginacion, EstadoCita? estado = null);
        Task<Result<CitaResponseDto>> GetByIdAsync(int id);
        Task<Result<CitaResponseDto>> CreateAsync(CitaRequestDto dto);
        Task<Result<CitaResponseDto>> UpdateAsync(int id, CitaRequestDto dto);
        Task<Result<CitaResponseDto>> CambiarEstadoAsync(int id, EstadoCita estado);
    }
}
