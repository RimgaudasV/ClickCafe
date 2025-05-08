using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs;
using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public MenuItemsController(ClickCafeContext db)
            => _db = db;

        // GET: api/MenuItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetAll()
        {
            var menuItems = await _db.MenuItems
                .Include(mi => mi.Cafe)
                                 .Include(mi => mi.AvailableCustomizations)
                                 .ToListAsync();

            var dtos = menuItems.Select(mi => new MenuItemDto
            {
                MenuItemId = mi.MenuItemId,
                CafeId = mi.CafeId,
                Name = mi.Name,
                Description = mi.Description,
                BasePrice = mi.BasePrice,
                Category = mi.Category,
                Image = mi.Image,
                AvailableCustomizationIds = mi.AvailableCustomizations.Select(c => c.CustomizationId)
            });

            return Ok(dtos);
        }

        // GET: api/MenuItems/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemDto>> GetById(int id)
        {
            var menuItem = await _db.MenuItems
                .Include(mi => mi.Cafe)
                .Include(mi => mi.AvailableCustomizations)
                .FirstOrDefaultAsync(mi => mi.MenuItemId == id);

            if (menuItem == null) return NotFound();

            var dto = new MenuItemDto
            {
                MenuItemId = menuItem.MenuItemId,
                CafeId = menuItem.CafeId,
                Name = menuItem.Name,
                Description = menuItem.Description,
                BasePrice = menuItem.BasePrice,
                Category = menuItem.Category,
                Image = menuItem.Image,
                AvailableCustomizationIds = menuItem.AvailableCustomizations.Select(c => c.CustomizationId)
            };

            return Ok(dto);
        }

        // POST: api/MenuItems
        [HttpPost]
        public async Task<ActionResult<MenuItemDto>> Create(CreateMenuItemDto createDto)
        {
            if (createDto == null) return BadRequest("Menu item cannot be null.");

            var customizations = createDto.AvailableCustomizationIds != null
                ? await _db.Customizations
                    .Where(c => createDto.AvailableCustomizationIds.Contains(c.CustomizationId))
                    .ToListAsync()
                : new List<Customization>();

            var menuItem = new MenuItem
            {
                CafeId = createDto.CafeId,
                Name = createDto.Name,
                Description = createDto.Description,
                BasePrice = createDto.BasePrice,
                Category = createDto.Category,
                Image = createDto.Image,
                AvailableCustomizations = customizations
            };

            _db.MenuItems.Add(menuItem);
            await _db.SaveChangesAsync();

            var itemDto = new MenuItemDto
            {
                MenuItemId = menuItem.MenuItemId,
                CafeId = menuItem.CafeId,
                Name = menuItem.Name,
                Description = menuItem.Description,
                BasePrice = menuItem.BasePrice,
                Category = menuItem.Category,
                Image = menuItem.Image,
                AvailableCustomizationIds = customizations.Select(c => c.CustomizationId)
            };

            return CreatedAtAction(nameof(GetById), new { id = menuItem.MenuItemId }, itemDto);
        }

        // PUT: api/MenuItems/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMenuItemDto updateDto)
        {
            var menuItem = await _db.MenuItems
                .Include(mi => mi.AvailableCustomizations)
                .FirstOrDefaultAsync(mi => mi.MenuItemId == id);

            if (menuItem == null) return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Name)) menuItem.Name = updateDto.Name;
            if (updateDto.CafeId > 0) menuItem.CafeId = updateDto.CafeId;
            if (!string.IsNullOrEmpty(updateDto.Description)) menuItem.Description = updateDto.Description;
            if (updateDto.BasePrice > 0) menuItem.BasePrice = updateDto.BasePrice;
            if (updateDto.Category > 0) menuItem.Category = updateDto.Category;
            if (!string.IsNullOrEmpty(updateDto.Image)) menuItem.Image = updateDto.Image;

            if (updateDto.AvailableCustomizationIds != null)
            {
                var customizations = await _db.Customizations
                    .Where(c => updateDto.AvailableCustomizationIds.Contains(c.CustomizationId))
                    .ToListAsync();
                menuItem.AvailableCustomizations = customizations;
            }

            _db.MenuItems.Add(menuItem);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/MenuItems/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
            {
            var menuItem = await _db.MenuItems
                .Include(mi => mi.AvailableCustomizations)
                .FirstOrDefaultAsync(mi => mi.MenuItemId == id);

            if (menuItem == null) return NotFound();
            _db.MenuItems.Remove(menuItem);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
