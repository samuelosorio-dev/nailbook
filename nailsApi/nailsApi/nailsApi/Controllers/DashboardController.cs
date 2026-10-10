using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NailsApi.Application.Interfaces;

namespace nailsApi.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController:ControllerBase
    {
        private readonly IDashboardService _service;
        private const string cacheTag = "citas";

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet("resumen")]
        [OutputCache(Tags = [cacheTag],Duration=3600)]
        public async Task<IActionResult> GetResumen()
        {
            var result = await _service.GetResumenAsync();
            return Ok(result.Data);
        }

        [HttpGet("top-clientas")]
        [OutputCache(Tags = [cacheTag],Duration=3600)]
        public async Task<IActionResult> GetTopClientas()
        {
            var result = await _service.GetTopClientasAsync();
            return Ok(result.Data);
        }
    }
}
