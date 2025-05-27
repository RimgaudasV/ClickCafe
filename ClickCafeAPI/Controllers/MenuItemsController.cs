using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs.MenuDTOs;
using ClickCafeAPI.Models.MenuModels;
using ClickCafeAPI.Models.MenuModels.CustomizationModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [ServiceFilter(typeof(LoggingActionFilter))]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public MenuItemsController(ClickCafeContext db)
            => _db = db;

        // GET: api/MenuItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetAll(
        [FromQuery] int? cafeId,
        [FromQuery] MenuItemCategory? category,
        [FromQuery] string sort = "name")
        {
            var query = _db.MenuItems
                .Include(mi => mi.Cafe)
                .Include(mi => mi.AvailableCustomizations)
                .AsQueryable();

            if (cafeId.HasValue)
                query = query.Where(mi => mi.CafeId == cafeId.Value);

            if (category.HasValue)
                query = query.Where(mi => mi.Category == category.Value);

            query = sort switch
            {
                "price_asc" => query.OrderBy(mi => mi.BasePrice),
                "price_desc" => query.OrderByDescending(mi => mi.BasePrice),
                "name" => query.OrderBy(mi => mi.Name),
                _ => query.OrderBy(mi => mi.Name)
            };

            var menuItems = await query.ToListAsync();

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
        public async Task<ActionResult<MenuItemDto>> Create([FromForm] CreateMenuItemDto createDto)
        {
            if (createDto == null) return BadRequest("Menu item cannot be null.");

            string imageFileName = null;
            if (createDto.Image != null && createDto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                Directory.CreateDirectory(uploadsFolder);

                imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(createDto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, imageFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createDto.Image.CopyToAsync(stream);
                }
            }

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
                Image = imageFileName,
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
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMenuItemDto updateDto, bool force = false)
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

            // Handle image upload
            if (updateDto.Image != null && updateDto.Image.Length > 0)
            {
                var fileName = Path.GetFileName(updateDto.Image.FileName);
                var savePath = Path.Combine("wwwroot/images", fileName);
                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await updateDto.Image.CopyToAsync(stream);
                }
                menuItem.Image = fileName;
            }

            // Handle customizations
            if (updateDto.AvailableCustomizationIds != null)
            {
                var customizations = await _db.Customizations
                    .Where(c => updateDto.AvailableCustomizationIds.Contains(c.CustomizationId))
                    .ToListAsync();
                menuItem.AvailableCustomizations = customizations;
            }

            _db.Entry(menuItem).Property(mi => mi.RowVersion).OriginalValue = updateDto.RowVersion;

            try
            {
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex) when (!force)
            {
                var dbEntry = ex.Entries.Single();
                var current = await dbEntry.GetDatabaseValuesAsync();

                return Conflict(new
                {
                    message = "This entity was changed by another user",
                    currentValues = current?.ToObject(),
                    currentRowVersion = current?["RowVersion"]
                });
            }

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
