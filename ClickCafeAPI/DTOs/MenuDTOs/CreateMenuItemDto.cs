using ClickCafeAPI.Models.MenuModels;

namespace ClickCafeAPI.DTOs.MenuDTOs
{
    public class CreateMenuItemDto
    {
        public int CafeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public MenuItemCategory Category { get; set; }
        public IFormFile Image { get; set; }
        public IEnumerable<int>? AvailableCustomizationIds { get; set; }
    }
}
