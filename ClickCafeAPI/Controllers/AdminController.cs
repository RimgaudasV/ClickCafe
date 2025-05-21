using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly ClickCafeContext _context;

    public AdminController(ClickCafeContext context)
    {
        _context = context;
    }

    [HttpGet("overview")]
    public IActionResult Overview()
    {
        return Ok(new
        {
            CafeCount = _context.Cafes.Count(),
            UserCount = _context.Users.Count(),
            MenuItemCount = _context.MenuItems.Count()
        });
    }
}
