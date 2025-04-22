using Microsoft.AspNetCore.Mvc;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {

        [HttpPost("login")]
        public IActionResult Login()
        {
            return Ok();
        }
    }
}
