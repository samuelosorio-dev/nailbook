using Mapster;
using NailsApi.Application.Common;
using NailsApi.Application.DTOs.Clientes;
using NailsApi.Application.Interfaces;
using NailsApi.Domain.Common;
using NailsApi.Domain.Entities;
using NailsApi.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Services
{
    public class ClienteService:IClienteService
    {
        private readonly IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }

        public async Task<Result<PaginacionResponseDto<ClienteResponseDto>>> GetAllAsync(PaginacionDto paginacion)
        {
            var clientes = await _repository.GetAllAsync(paginacion);
            var total = await _repository.GetTotalAsync();

            var response = new PaginacionResponseDto<ClienteResponseDto>
            {
                Data = clientes.Adapt<List<ClienteResponseDto>>(),
                TotalRegistros = total,
                TotalPaginas = (int)Math.Ceiling((double)total / paginacion.RecordsPorPagina),
                PaginaActual = paginacion.Pagina
            };

            return Result<PaginacionResponseDto<ClienteResponseDto>>.Success(response);
        }

        public async Task<Result<ClienteResponseDto>> GetByIdAsync(int id)
        {
            var cliente = await _repository.GetByIdAsync(id);
            if (cliente is null)
                return Result<ClienteResponseDto>.Failure("Cliente no encontrado");

            return Result<ClienteResponseDto>.Success(cliente.Adapt<ClienteResponseDto>());
        }

        public async Task<Result<ClienteResponseDto>> CreateAsync(ClienteRequestDto dto)
        {

            var cliente = dto.Adapt<Cliente>();
            var creado = await _repository.CreateAsync(cliente);
            return Result<ClienteResponseDto>.Success(creado.Adapt<ClienteResponseDto>());
        }

        public async Task<Result<IEnumerable<ClienteResponseDto>>> SearchAsync(string termino)
        {
            var clientes = await _repository.SearchAsync(termino);
            var dto = clientes.Adapt<IEnumerable<ClienteResponseDto>>();
            return Result<IEnumerable<ClienteResponseDto>>.Success(dto);
        }

        public async Task<Result<ClienteResponseDto>> UpdateAsync(int id, ClienteRequestDto dto)
        {
            var cliente = await _repository.GetByIdAsync(id);
            if (cliente is null)
                return Result<ClienteResponseDto>.Failure("Cliente no encontrado");

            dto.Adapt(cliente);
            var actualizado = await _repository.UpdateAsync(cliente);
            return Result<ClienteResponseDto>.Success(actualizado.Adapt<ClienteResponseDto>());
        }
    }
}
