using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ClickCafeAPI.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/alerts")]
    public class AlertController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public AlertController(ClickCafeContext db) => _db = db;

        // GET: api/alerts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetUnread()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var alerts = await _db.OrderAlerts
                .Where(a => a.UserId == userId && !a.IsRead)
                .OrderBy(a => a.CreatedUtc)
                .ToListAsync();

            alerts.ForEach(a => a.IsRead = true);
            await _db.SaveChangesAsync();

            return alerts.Select(a => a.Text).ToList();
        }
    }
}
