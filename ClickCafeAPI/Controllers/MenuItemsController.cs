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
            var items = await _db.MenuItems
                                 .Include(mi => mi.AvailableCustomizations)
                                 .ToListAsync();

            var dtos = items.Select(mi => new MenuItemDto
            {
                MenuItemId = mi.MenuItemId,
                CafeId = mi.CafeId,
                Name = mi.Name,
                Description = mi.Description,
                BasePrice = mi.BasePrice,
                Category = mi.Category,
                Image = mi.Image,
                AvailableCustomizationIds = mi.AvailableCustomizations
                                                .Select(c => c.CustomizationId)
                                                .ToList()
            });

            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<MenuItemDto>> Create(CreateMenuItemDto createDto)
        {
            var entity = new MenuItem
            {
                CafeId = createDto.CafeId,
                Name = createDto.Name,
                Description = createDto.Description,
                BasePrice = createDto.BasePrice,
                Category = createDto.Category,
                Image = createDto.Image
            };

            if (createDto.AvailableCustomizationIds?.Any() == true)
            {
                var customs = await _db.Customizations
                    .Where(c => createDto.AvailableCustomizationIds.Contains(c.CustomizationId))
                    .ToListAsync();
                entity.AvailableCustomizations = customs;
            }

            _db.MenuItems.Add(entity);
            await _db.SaveChangesAsync();

            var dto = new MenuItemDto
            {
                MenuItemId = entity.MenuItemId,
                CafeId = entity.CafeId,
                Name = entity.Name,
                Description = entity.Description,
                BasePrice = entity.BasePrice,
                Category = entity.Category,
                Image = entity.Image,
                AvailableCustomizationIds = entity.AvailableCustomizations
                                                .Select(c => c.CustomizationId)
                                                .ToList()
            };

            return CreatedAtAction(nameof(GetAll), null, dto);
        }
    }
}
