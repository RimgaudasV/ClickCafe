using ClickCafeAPI.Models;
using ClickCafeAPI.ViewModels;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;
using Microsoft.EntityFrameworkCore;

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
            Console.WriteLine("==> Register called");
            Console.WriteLine($"CafeId: {model.CafeId}, Role: {model.Role}");

            if (model.Role == UserRole.Barista && model.CafeId.HasValue)
            {
                var cafe = await _db.Cafes.FindAsync(model.CafeId.Value);
                if (cafe == null)
                {
                    Console.WriteLine("❌ Invalid cafe selected");
                    return BadRequest("Invalid cafe.");
                }
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
            if (!result.Succeeded)
            {
                foreach (var err in result.Errors)
                    Console.WriteLine($"❌ {err.Description}");
                return BadRequest(result.Errors);
            }

            var trackedUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (trackedUser != null && model.CafeId.HasValue && model.Role == UserRole.Barista)
            {
                trackedUser.CafeId = model.CafeId.Value;
                _db.Entry(trackedUser).Property(u => u.CafeId).IsModified = true;
                await _db.SaveChangesAsync();

                Console.WriteLine($"✅ CafeId saved: {trackedUser.CafeId}");
            }
            else
            {
                Console.WriteLine("⚠️ User not found after creation or CafeId not set");
            }

            return Ok(new { message = "Registration successful" });
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
