using ClickCafeAPI.Models.MenuModels.CustomizationModels;

namespace ClickCafeAPI.DTOs.MenuDTOs.CustomizationDTOs
{
    public class UpdateCustomizationDto
    {
        public int CustomizationId { get; set; }
        public string Name { get; set; } = null!;
        public CustomizationType Type { get; set; }
        public List<CreateCustomizationOptionDto> Options { get; set; }
        public IEnumerable<int> MenuItemIds { get; set; } = new List<int>();
        public IEnumerable<int> OrderItemIds { get; set; } = new List<int>();
    }
}