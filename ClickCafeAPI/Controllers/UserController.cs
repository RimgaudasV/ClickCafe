using ClickCafeAPI.Models.UserModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UserController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.Users
                .Include(u => u.OrderHistory)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            if (user == null) return Unauthorized();

            return Ok(new
            {
                username = user.DisplayName,
                email = user.Email,
                orderCount = user.OrderHistory?.Count ?? 0
            });
        }

        [HttpPut("me/displayname")]
        public async Task<IActionResult> UpdateDisplayName([FromBody] string newDisplayName)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (user == null) return Unauthorized();

            user.DisplayName = newDisplayName;
            await _userManager.UpdateAsync(user);

            return Ok();
        }

    }

}
