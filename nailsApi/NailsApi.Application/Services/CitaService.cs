using Mapster;
using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Citas;
using NailsApi.Application.Interfaces;
using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Enums;
using NailsApi.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Services
{
    public class CitaService:ICitaService
    {
        private readonly ICitaRepository _citaRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly IServicioRepository _servicioRepository;

        public CitaService(
            ICitaRepository citaRepository,
            IClienteRepository clienteRepository,
            IServicioRepository servicioRepository)
        {
            _citaRepository = citaRepository;
            _clienteRepository = clienteRepository;
            _servicioRepository = servicioRepository;
        }

        public async Task<Result<PaginacionResponseDto<CitaResponseDto>>> GetAllAsync(
            PaginacionDto paginacion, EstadoCita? estado = null)
        {
            var citas = await _citaRepository.GetAllAsync(paginacion, estado);
            var total = await _citaRepository.GetTotalAsync(estado);

            var response = new PaginacionResponseDto<CitaResponseDto>
            {
                Data = citas.Adapt<List<CitaResponseDto>>(),
                TotalRegistros = total,
                TotalPaginas = (int)Math.Ceiling((double)total / paginacion.RecordsPorPagina),
                PaginaActual = paginacion.Pagina
            };

            return Result<PaginacionResponseDto<CitaResponseDto>>.Success(response);
        }

        public async Task<Result<CitaResponseDto>> GetByIdAsync(int id)
        {
            var cita = await _citaRepository.GetByIdAsync(id);
            if (cita is null)
                return Result<CitaResponseDto>.Failure("Cita no encontrada");

            return Result<CitaResponseDto>.Success(cita.Adapt<CitaResponseDto>());
        }
        

        private async Task<Result<Cita>> ValidacionPrevia(CitaRequestDto citaRequestDto, Cita? citaExistente=null) 
        {
            var cliente = await _clienteRepository.GetByIdAsync(citaRequestDto.ClienteId);

            if (cliente is null)
                   return Result<Cita>.Failure("El cliente no existe");

            var servicios = new List<Servicio>();
                foreach (var servicioId in citaRequestDto.ServiciosIds)
                {
                    var servicio = await _servicioRepository.GetByIdAsync(servicioId);
                    if (servicio is null)
                        return Result<Cita>.Failure($"El servicio con Id {servicioId} no existe");
                    servicios.Add(servicio);
                }

            var duracionTotal = servicios.Sum(s => s.Duracion);
            var horaFin = citaRequestDto.HoraInicio.AddMinutes(duracionTotal);

            var cita = citaExistente ?? new Cita
            {
                Estado = EstadoCita.Programada
            };

            cita.ClienteId = citaRequestDto.ClienteId;
            cita.Fecha = citaRequestDto.Fecha;
            cita.HoraInicio = citaRequestDto.HoraInicio;
            cita.HoraFin = horaFin;
            cita.Duracion = duracionTotal;
            cita.CitaServicios = servicios.Select(s => new CitaServicio
            {
                ServicioId = s.Id
            }).ToList();

            return Result<Cita>.Success(cita);
        }


        public async Task<Result<CitaResponseDto>> CreateAsync(CitaRequestDto dto)
        {
            var citaValidada = await ValidacionPrevia(dto);

            if (!citaValidada.IsSuccess)
                return Result<CitaResponseDto>.Failure(citaValidada.ErrorMessage!);

            var creada = await _citaRepository.CreateAsync(citaValidada.Data!);
            return Result<CitaResponseDto>.Success(creada.Adapt<CitaResponseDto>());
        }

        

        public async Task<Result<CitaResponseDto>> UpdateAsync(int id, CitaRequestDto dto)
        {
            var cita = await _citaRepository.GetByIdAsync(id);

            if (cita is null)
                return Result<CitaResponseDto>.Failure("Cita no encontrada");

            if (cita.Estado != EstadoCita.Programada)
                return Result<CitaResponseDto>.Failure("Solo se pueden editar citas programadas");

            var citaValidada = await ValidacionPrevia(dto, cita);

            if (!citaValidada.IsSuccess)
                return Result<CitaResponseDto>.Failure(citaValidada.ErrorMessage!);

            var actualizada = await _citaRepository.UpdateAsync(citaValidada.Data!);
            return Result<CitaResponseDto>.Success(actualizada.Adapt<CitaResponseDto>());
        }

        public async Task<Result<CitaResponseDto>> CambiarEstadoAsync(int id, EstadoCita estado)
        {
            var cita = await _citaRepository.GetByIdAsync(id);
            if (cita is null)
                return Result<CitaResponseDto>.Failure("Cita no encontrada");

            if (cita.Estado != EstadoCita.Programada)
                return Result<CitaResponseDto>.Failure("Solo se pueden cambiar citas programadas");

            cita.Estado = estado;
            var actualizada = await _citaRepository.UpdateEstadoAsync(cita);
            return Result<CitaResponseDto>.Success(actualizada.Adapt<CitaResponseDto>());
        }
    }
}
