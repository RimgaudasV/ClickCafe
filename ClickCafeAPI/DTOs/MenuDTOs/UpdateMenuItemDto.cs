using ClickCafeAPI.Models.MenuModels;
using Microsoft.AspNetCore.Mvc;

namespace ClickCafeAPI.DTOs.MenuDTOs
{
    public class UpdateMenuItemDto
    {
        public int MenuItemId { get; set; }
        public int CafeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public MenuItemCategory Category { get; set; }
        [FromForm(Name = "image")]
        public IFormFile? Image { get; set; }

        [FromForm(Name = "AvailableCustomizationIds")]
        public List<int> AvailableCustomizationIds { get; set; } = new();
    }
}