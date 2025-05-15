using ClickCafeAPI.Models;
using ClickCafeAPI.ViewModels;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {


        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ClickCafeContext _db;
        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, ClickCafeContext db)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _db = db;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: true, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                return Ok(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    role = user.Role.ToString()
                });

            }

            return BadRequest("Invalid login attempt");
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (model.Role == UserRole.Barista && model.CafeId.HasValue)
            {
                var cafe = await _db.Cafes.FindAsync(model.CafeId.Value);
                if (cafe == null)
                    return BadRequest("Invalid Cafe selected.");
            }

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                DisplayName = model.UserName,
                Role = model.Role,
                CafeId = model.Role == UserRole.Barista ? model.CafeId : null
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Registration successful" });
            }

            return BadRequest(result.Errors);
        }




        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok();
        }


        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.UserName,
                role = user.Role.ToString()
            });
        }
    }
}
