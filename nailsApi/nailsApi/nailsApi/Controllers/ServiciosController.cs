using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NailsApi.Application.DTOs.Servicios;
using NailsApi.Application.Interfaces;

namespace nailsApi.Controllers
{
    [ApiController]
    [Route("api/servicios")]
    public class ServiciosController:ControllerBase
    {
        private readonly IServicioService _service;
        private readonly IValidator<ServicioRequestDto> _validator;
        private readonly IOutputCacheStore _outputCacheStore;
        private const string cacheTag = "servicios";

        public ServiciosController(
            IServicioService service,
            IValidator<ServicioRequestDto> validator,
            IOutputCacheStore outputCacheStore)
        {
            _service = service;
            _validator = validator;
            _outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
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
        public async Task<IActionResult> Create([FromBody] ServicioRequestDto dto)
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
        public async Task<IActionResult> Update(int id, [FromBody] ServicioRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(validation.Errors.Select(x => x.ErrorMessage));

            var result = await _service.UpdateAsync(id, dto);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);

            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return Ok(result.Data);
        }
    }
}
