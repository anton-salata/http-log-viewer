using Microsoft.AspNetCore.Mvc;
using HttpLogViewer.Api.Models;
using HttpLogViewer.Api.Repositories;

namespace HttpLogViewer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HttpLogController : ControllerBase
    {
        private readonly HttpTrackingRepository _httpLogRepository;

        public HttpLogController(HttpTrackingRepository httpLogRepository)
        {
            _httpLogRepository = httpLogRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _httpLogRepository.GetAll();

            return Ok(logs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HttpLogRecord>> GetLogById(string id)
        {
            var log = await _httpLogRepository.GetById(id);
            if (log == null)
            {
                return NotFound();
            }
            return Ok(log);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<HttpLogRecord>>> GetFilteredLogs([FromQuery] string uri, [FromQuery] string method, [FromQuery] string statusCode, [FromQuery] string reasonPhrase)
        {
            var logs = await _httpLogRepository.GetFilteredAsync(uri, method, statusCode, reasonPhrase);
            return Ok(logs);
        }
    }
}
