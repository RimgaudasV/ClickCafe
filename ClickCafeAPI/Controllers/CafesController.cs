using System.Collections.Generic;
using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs;
using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [ServiceFilter(typeof(LoggingActionFilter))]
    [Route("api/[controller]")]
    public class CafesController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        private readonly IWebHostEnvironment _env;
        public CafesController(ClickCafeContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

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
                Image = c.Image,
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
                Image = c.Image,
                MenuItemIds = c.MenuItems.Select(mi => mi.MenuItemId)
            };
            return Ok(dto);
        }

        // POST: api/Cafes
        [HttpPost]
        public async Task<ActionResult<CafeDto>> Create([FromForm] string name, [FromForm] string address, [FromForm] string phoneNumber, [FromForm] string operatingHours, [FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("Image file is required.");

            var imagesDir = Path.Combine(_env.WebRootPath, "cafeImages");
            if (!Directory.Exists(imagesDir))
                Directory.CreateDirectory(imagesDir);

            var ext = Path.GetExtension(image.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(imagesDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            var cafe = new Cafe
            {
                Name = name,
                Address = address,
                PhoneNumber = phoneNumber,
                OperatingHours = operatingHours,
                Image = $"/cafeImages/{fileName}"
            };

            _db.Cafes.Add(cafe);
            await _db.SaveChangesAsync();

            var dto = new CafeDto
            {
                CafeId = cafe.CafeId,
                Name = cafe.Name,
                Address = cafe.Address,
                PhoneNumber = cafe.PhoneNumber,
                OperatingHours = cafe.OperatingHours,
                Image = cafe.Image,
                MenuItemIds = new List<int>()
            };

            return CreatedAtAction(nameof(GetById), new { id = dto.CafeId }, dto);
        }


        // POST: api/Cafes/{id}/image
        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            var cafe = await _db.Cafes.FindAsync(id);
            if (cafe == null) return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No image file provided.");

            // set wwwroot/cafeImages
            var imagesDir = Path.Combine(_env.WebRootPath, "cafeImages");
            if (!Directory.Exists(imagesDir))
                Directory.CreateDirectory(imagesDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Path.GetRandomFileName()}{ext}";
            var filePath = Path.Combine(imagesDir, fileName);

            // save to disk
            await using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);

            // update DB
            cafe.Image = $"/cafeImages/{fileName}";
            await _db.SaveChangesAsync();

            return NoContent();
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
            if (!string.IsNullOrEmpty(updateDto.Image)) cafe.Image = updateDto.Image;

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
