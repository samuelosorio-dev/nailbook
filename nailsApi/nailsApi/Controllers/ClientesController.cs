using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NailsApi.Application.DTOs.Clientes;
using NailsApi.Application.Interfaces;
using NailsApi.Domain.Common;

namespace nailsApi.Controllers
{
    [ApiController]
    [Route("api/clientes")]
    public class ClientesController:ControllerBase
    {
        private readonly IClienteService _service;
        private readonly IValidator<ClienteRequestDto> _validator;
        private readonly IOutputCacheStore outputCacheStore;
        private const string cacheTag = "clientes";

        public ClientesController(IClienteService service, IValidator<ClienteRequestDto> validator,IOutputCacheStore outputCacheStore)
        {
            _service = service;
            _validator = validator;
            this.outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> GetAll([FromQuery] PaginacionDto paginacion)
        {
            var result = await _service.GetAllAsync(paginacion);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);
            return Ok(result.Data);
        }

        [HttpGet("{id:int}")]
        //[OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);
            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClienteRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(validation.Errors.Select(x => x.ErrorMessage));

            var result = await _service.CreateAsync(dto);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string termino)
        {
            var result = await _service.SearchAsync(termino);
            return Ok(result.Data);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClienteRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(validation.Errors.Select(x => x.ErrorMessage));

            var result = await _service.UpdateAsync(id, dto);
            if (!result.IsSuccess) return NotFound(result.ErrorMessage);
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return Ok(result.Data);
        }
    }
}
