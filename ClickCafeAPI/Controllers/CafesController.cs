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
    public class CafesController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public CafesController(ClickCafeContext db)
            => _db = db;

        // GET: api/Cafes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CafeDto>>> GetAll()
        {
            // loadinas visos
            var cafes = await _db.Cafes
                .Include(c => c.MenuItems)    // turi menuitems tai parodom
                .ToListAsync();

            //  Map each Cafe entity to a CafeDto
            var dtos = cafes.Select(c => new CafeDto
            {
                CafeId = c.CafeId,
                Name = c.Name,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber,
                OperatingHours = c.OperatingHours,
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId)
            });

            return Ok(dtos);
        }

        // GET: api/Cafes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CafeDto>> GetById(int id)
        {
            // pagal primary key
            var c = await _db.Cafes
                .Include(ca => ca.MenuItems)
                .FirstOrDefaultAsync(ca => ca.CafeId == id);

            if (c == null) return NotFound();

            // Map to DTO
            var dto = new CafeDto
            {
                CafeId = c.CafeId,
                Name = c.Name,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber,
                OperatingHours = c.OperatingHours,
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId)
            };
            return Ok(dto);
        }

        // POST: api/Cafes
        [HttpPost]
        public async Task<ActionResult<CafeDto>> Create(CreateCafeDto createDto)
        {
            // CreateCafeDto > Cafe entity
            var cafe = new Cafe
            {
                Name = createDto.Name,
                Address = createDto.Address,
                PhoneNumber = createDto.PhoneNumber,
                OperatingHours = createDto.OperatingHours
            };

            // Persist
            _db.Cafes.Add(cafe);
            await _db.SaveChangesAsync();

            // entity > CafeDto
            var dto = new CafeDto
            {
                CafeId = cafe.CafeId,
                Name = cafe.Name,
                Address = cafe.Address,
                PhoneNumber = cafe.PhoneNumber,
                OperatingHours = cafe.OperatingHours,
                MenuItemIds = new List<int>()  
            };

            
            return CreatedAtAction(nameof(GetById), new { id = dto.CafeId }, dto);
        }

        // PUT : api/Cafes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCafeDto updateDto)
        {
            var cafe = await _db.Cafes
                .Include(ca => ca.MenuItems)
                .FirstOrDefaultAsync(ca => ca.CafeId == id);
            if (cafe == null) return NotFound();

            // Update the cafe entity for the fields that are not null or empty
            if (!string.IsNullOrEmpty(updateDto.Name)) cafe.Name = updateDto.Name;
            if (!string.IsNullOrEmpty(updateDto.Address)) cafe.Address = updateDto.Address;
            if (!string.IsNullOrEmpty(updateDto.PhoneNumber)) cafe.PhoneNumber = updateDto.PhoneNumber;
            if (!string.IsNullOrEmpty(updateDto.OperatingHours)) cafe.OperatingHours = updateDto.OperatingHours;

            await _db.SaveChangesAsync();
            return NoContent();
        }
        // DELETE: api/Cafes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cafe = await _db.Cafes
                .Include(ca => ca.MenuItems)
                .FirstOrDefaultAsync(ca => ca.CafeId == id);
            if (cafe == null) return NotFound();

            _db.Cafes.Remove(cafe);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
