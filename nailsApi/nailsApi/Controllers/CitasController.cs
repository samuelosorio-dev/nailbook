using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NailsApi.Application.DTOs.Citas;
using NailsApi.Application.Interfaces;
using NailsApi.Domain.Common;
using NailsApi.Domain.Enums;

namespace nailsApi.Controllers
{
    [ApiController]
    [Route("api/citas")]
    public class CitasController:ControllerBase
    {
        private readonly ICitaService _service;
        private readonly IValidator<CitaRequestDto> _validator;
        private readonly IOutputCacheStore _outputCacheStore;
        private const string cacheTag = "citas";

        public CitasController(
            ICitaService service,
            IValidator<CitaRequestDto> validator,
            IOutputCacheStore outputCacheStore)
        {
            _service = service;
            _validator = validator;
            _outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> GetAll(
            [FromQuery] PaginacionDto paginacion,
            [FromQuery] EstadoCita? estado = null)
        {
            var result = await _service.GetAllAsync(paginacion, estado);
            return Ok(result.Data);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);
            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CitaRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(validation.Errors.Select(x => x.ErrorMessage));

            var result = await _service.CreateAsync(dto);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);

            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CitaRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(validation.Errors.Select(x => x.ErrorMessage));

            var result = await _service.UpdateAsync(id, dto);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);

            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return Ok(result.Data);
        }

        [HttpPatch("{id:int}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromQuery] EstadoCita estado)
        {
            var result = await _service.CambiarEstadoAsync(id, estado);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);

            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return Ok(result.Data);
        }
    }
}
