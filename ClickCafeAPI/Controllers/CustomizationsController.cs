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
                .Include(c => c.Options)
                .ToListAsync();

            var dtos = customizations.Select(c => new CustomizationDto
            {
                CustomizationId = c.CustomizationId,
                Name = c.Name,
                Type = c.Type,
                OptionIds = c.Options.Select(o => o.CustomizationOptionId),
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId),
                OrderItemIds = c.OrderItems.Select(oi => oi.OrderItemId)
            }); ;

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
                .Include(c => c.Options)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            var dto = new CustomizationDto
            {
                CustomizationId = customization.CustomizationId,
                Name = customization.Name,
                Type = customization.Type,
                OptionIds = customization.Options.Select(o => o.CustomizationOptionId),
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

            var optionItems = createDto.OptionIds != null
                ? await _db.CustomizationOptions
                    .Where(opt => createDto.OptionIds.Contains(opt.CustomizationOptionId))
                    .ToListAsync()
                : new List<CustomizationOption>();

            var customization = new Customization
            {
                Name = createDto.Name,
                Type = createDto.Type,
                Options = optionItems,
                MenuItems = menuItems
            };

            _db.Customizations.Add(customization);
            await _db.SaveChangesAsync();

            var customizationDto = new CustomizationDto
            {
                CustomizationId = customization.CustomizationId,
                Name = customization.Name,
                Type = customization.Type,
                OptionIds = customization.Options.Select(o => o.CustomizationOptionId),
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
                .Include(c => c.Options)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Name)) customization.Name = updateDto.Name;
            if (updateDto.Type != default) customization.Type = updateDto.Type;

            if (updateDto.OptionIds != null)
            {
                var optionEntities = await _db.CustomizationOptions
                    .Where(o => updateDto.OptionIds.Contains(o.CustomizationOptionId))
                    .ToListAsync();

                customization.Options = optionEntities;
            }

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
