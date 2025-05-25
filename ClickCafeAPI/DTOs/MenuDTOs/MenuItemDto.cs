using ClickCafeAPI.Models.MenuModels;

namespace ClickCafeAPI.DTOs.MenuDTOs
{
    public class MenuItemDto
    {
        public int MenuItemId { get; set; }
        public int CafeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public MenuItemCategory Category { get; set; }
        public string? Image { get; set; }
        public IEnumerable<int> AvailableCustomizationIds { get; set; } = new List<int>();
    }
}