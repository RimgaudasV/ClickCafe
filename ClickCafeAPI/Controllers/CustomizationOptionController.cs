using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs;
using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ClickCafeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomizationOptionController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public CustomizationOptionController(ClickCafeContext db)
            => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomizationOptionDto>>> GetAll()
        {
            var options = await _db.CustomizationOptions.ToListAsync();

            var dtos = options.Select(o => new CustomizationOptionDto
            {
                CustomizationOptionId = o.CustomizationOptionId,
                Name = o.Name,
                ExtraCost = o.ExtraCost
            });

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomizationOptionDto>> GetById(int id)
        {
            var option = await _db.CustomizationOptions.FindAsync(id);
            if (option == null) return NotFound();

            return Ok(new CustomizationOptionDto
            {
                CustomizationOptionId = option.CustomizationOptionId,
                Name = option.Name,
                ExtraCost = option.ExtraCost
            });
        }

        [HttpPost]
        public async Task<ActionResult<CustomizationOptionDto>> Create(CreateCustomizationOptionDto createDto)
        {
            var option = new CustomizationOption
            {
                Name = createDto.Name,
                ExtraCost = createDto.ExtraCost
            };

            _db.CustomizationOptions.Add(option);
            await _db.SaveChangesAsync();

            var result = new CustomizationOptionDto
            {
                CustomizationOptionId = option.CustomizationOptionId,
                Name = option.Name,
                ExtraCost = option.ExtraCost
            };

            return CreatedAtAction(nameof(GetById), new { id = result.CustomizationOptionId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCustomizationOptionDto dto)
        {
            var option = await _db.CustomizationOptions.FindAsync(id);
            if (option == null) return NotFound();

            option.Name = dto.Name;
            option.ExtraCost = dto.ExtraCost;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var option = await _db.CustomizationOptions.FindAsync(id);
            if (option == null) return NotFound();

            _db.CustomizationOptions.Remove(option);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
