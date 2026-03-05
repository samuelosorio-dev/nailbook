using Mapster;
using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Servicios;
using NailsApi.Application.Interfaces;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Services
{
    public class ServicioService:IServicioService
    {
        private readonly IServicioRepository _repository;

        public ServicioService(IServicioRepository repository)
        {
            _repository = repository;
        }

        public async Task<Result<List<ServicioResponseDto>>> GetAllAsync()
        {
            var servicios = await _repository.GetAllAsync();
            var dto = servicios.Adapt<List<ServicioResponseDto>>();
            return Result<List<ServicioResponseDto>>.Success(dto);
        }

        public async Task<Result<ServicioResponseDto>> GetByIdAsync(int id)
        {
            var servicio = await _repository.GetByIdAsync(id);
            if (servicio is null)
                return Result<ServicioResponseDto>.Failure("Servicio no encontrado");

            var dto = servicio.Adapt<ServicioResponseDto>();
            return Result<ServicioResponseDto>.Success(dto);
        }

        public async Task<Result<ServicioResponseDto>> CreateAsync(ServicioRequestDto dto)
        {
            //var nombreExistente = await _repository.GetByNombreAsync(dto.Nombre);
            //if (nombreExistente is not null)
            //    return Result<ServicioResponseDto>.Failure("Ya existe un servicio con ese nombre");

            var servicio = dto.Adapt<Servicio>();
            var creado = await _repository.CreateAsync(servicio);
            return Result<ServicioResponseDto>.Success(creado.Adapt<ServicioResponseDto>());
        }

        public async Task<Result<ServicioResponseDto>> UpdateAsync(int id, ServicioRequestDto dto)
        {
            var servicio = await _repository.GetByIdAsync(id);
            if (servicio is null)
                return Result<ServicioResponseDto>.Failure("Servicio no encontrado");

            //var nombreExistente = await _repository.GetByNombreAsync(dto.Nombre);
            //if (nombreExistente is not null && nombreExistente.Id != id)
            //    return Result<ServicioResponseDto>.Failure("Ya existe un servicio con ese nombre");

            dto.Adapt(servicio);
            var actualizado = await _repository.UpdateAsync(servicio);
            return Result<ServicioResponseDto>.Success(actualizado.Adapt<ServicioResponseDto>());
        }
    }
}
