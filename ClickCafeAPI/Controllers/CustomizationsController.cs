using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs.MenuDTOs.CustomizationDTOs;
using ClickCafeAPI.Models.MenuModels;
using ClickCafeAPI.Models.MenuModels.CustomizationModels;
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
                .Include(c => c.Options)
                .ToListAsync();

            var dtos = customizations.Select(c => new CustomizationDto
            {
                CustomizationId = c.CustomizationId,
                Name = c.Name,
                Type = c.Type,
                Options = c.Options.Select(o => new CustomizationOptionDto
                {
                    CustomizationOptionId = o.CustomizationOptionId,
                    Name = o.Name,
                    ExtraCost = o.ExtraCost
                }),
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId)
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
                .Include(c => c.Options)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            var dto = new CustomizationDto
            {
                CustomizationId = customization.CustomizationId,
                Name = customization.Name,
                Type = customization.Type,
                Options = customization.Options.Select(o => new CustomizationOptionDto
                {
                    CustomizationOptionId = o.CustomizationOptionId,
                    Name = o.Name,
                    ExtraCost = o.ExtraCost
                }),
                MenuItemIds = customization.MenuItems.Select(mi => mi.MenuItemId)
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

            var optionItems = createDto.Options?.Select(o => new CustomizationOption
            {
                Name = o.Name,
                ExtraCost = o.ExtraCost
            }).ToList() ?? new List<CustomizationOption>();

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
                Options = customization.Options.Select(o => new CustomizationOptionDto
                {
                    CustomizationOptionId = o.CustomizationOptionId,
                    Name = o.Name,
                    ExtraCost = o.ExtraCost
                }),
                MenuItemIds = customization.MenuItems.Select(mi => mi.MenuItemId)
            };

            return CreatedAtAction(nameof(GetById), new { id = customization.CustomizationId }, customizationDto);
        }

        // GET: api/Customizations/menuItem/{menuItemId}
        [HttpGet("menuItem/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<CustomizationDto>>> GetByMenuItem(int menuItemId)
        {
            var customizations = await _db.Customizations
                .Where(c => c.MenuItems.Any(mi => mi.MenuItemId == menuItemId))
                .Include(c => c.Options)
                .Include(c => c.MenuItems)
                .ToListAsync();

            var dtos = customizations.Select(c => new CustomizationDto
            {
                CustomizationId = c.CustomizationId,
                Name = c.Name,
                Type = c.Type,
                Options = c.Options.Select(o => new CustomizationOptionDto
                {
                    CustomizationOptionId = o.CustomizationOptionId,
                    Name = o.Name,
                    ExtraCost = o.ExtraCost
                }),
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId)
            });

            return Ok(dtos);
        }

        [HttpGet("orderItem/{orderItemId}/options")]
        public async Task<ActionResult<IEnumerable<CustomizationOption>>> GetCustomizationOptions(int orderItemId)
        {
            var optionIds = await _db.OrderItemCustomizationOptions
                .Where(o => o.OrderItemId == orderItemId)
                .Select(o => o.CustomizationOptionId)
                .ToListAsync();

            var options = await _db.CustomizationOptions
                .Where(opt => optionIds.Contains(opt.CustomizationOptionId))
                .ToListAsync();

            return Ok(options);
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

            if (updateDto.Options != null)
            {
                _db.CustomizationOptions.RemoveRange(customization.Options);

                customization.Options = updateDto.Options.Select(o => new CustomizationOption
                {
                    Name = o.Name,
                    ExtraCost = o.ExtraCost
                }).ToList();
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
                .Include(c => c.Options)
                .FirstOrDefaultAsync(c => c.CustomizationId == id);

            if (customization == null) return NotFound();

            _db.Customizations.Remove(customization);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
