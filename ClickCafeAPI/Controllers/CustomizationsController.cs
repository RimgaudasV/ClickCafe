using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs;
using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomizationsController : Controller
    {
        private readonly ClickCafeContext _db;
        public CustomizationsController(ClickCafeContext db)
            => _db = db;

        // GET: api/Customizations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customization>>> GetAll()
        {
            var customizations = await _db.Customizations
                .Include(c => c.MenuItems)
                .Include(c => c.OrderItems)
                .ToListAsync();

            var dtos = customizations.Select(c => new CustomizationDto
            {
                CustomizationId = c.CustomizationId,
                Name = c.Name,
                Options = c.Options,
                ExtraCost = c.ExtraCost,
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId),
                OrderItemIds = c.OrderItems.Select(oi => oi.OrderItemId)
            });

            return Ok(dtos);
        }

        // GET: api/Customizations/{id}
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<CustomizationDto>> GetById(int id)
        {
            var customization = await _db.Customizations
                .Include(c => c.MenuItems)
                .Include(c => c.OrderItems)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            var dto = new CustomizationDto
            {
                CustomizationId = customization.CustomizationId,
                Name = customization.Name,
                Options = customization.Options,
                ExtraCost = customization.ExtraCost,
                MenuItemIds = customization.MenuItems.Select(mi => mi.MenuItemId),
                OrderItemIds = customization.OrderItems.Select(oi => oi.OrderItemId)
            };

            return Ok(dto);
        }

        // POST: api/Customizations
        [HttpPost]
        public async Task<ActionResult<CustomizationDto>> Create(CreateCustomizationDto createDto)
        {
            var menuItems = createDto.MenuItemIds != null
                ? await _db.MenuItems
                    .Where(mi => createDto.MenuItemIds.Contains(mi.MenuItemId))
                    .ToListAsync()
                : new List<MenuItem>();

            var customization = new Customization
            {
                Name = createDto.Name,
                Options = createDto.Options?.ToList() ?? new List<string>(),
                ExtraCost = createDto.ExtraCost,
                MenuItems = menuItems
            };

            _db.Customizations.Add(customization);
            await _db.SaveChangesAsync();

            var customizationDto = new CustomizationDto
            {
                CustomizationId = customization.CustomizationId,
                Name = customization.Name,
                Options = customization.Options ?? new List<string>(),
                ExtraCost = customization.ExtraCost,
                MenuItemIds = customization.MenuItems.Select(mi => mi.MenuItemId),
                OrderItemIds = customization.OrderItems.Select(oi => oi.OrderItemId)
            };

            return CreatedAtAction(nameof(GetById), new { id = customization.CustomizationId }, customizationDto);
        }

        // PUT: api/Customizations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomizationDto updateDto)
        {
            var customization = await _db.Customizations
                .Include(c => c.MenuItems)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Name)) customization.Name = updateDto.Name;
            if (updateDto.Options != null && updateDto.Options.Any()) customization.Options = updateDto.Options?.ToList() ?? new List<string>();
            if (updateDto.ExtraCost > 0) customization.ExtraCost = updateDto.ExtraCost;

            if (updateDto.MenuItemIds != null)
            {
                var menuItems = await _db.MenuItems
                    .Where(mi => updateDto.MenuItemIds.Contains(mi.MenuItemId))
                    .ToListAsync();

                customization.MenuItems = menuItems;
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Customizations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customization = await _db.Customizations
                .Include(c => c.MenuItems)
                .Include(c => c.OrderItems)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            _db.Customizations.Remove(customization);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
