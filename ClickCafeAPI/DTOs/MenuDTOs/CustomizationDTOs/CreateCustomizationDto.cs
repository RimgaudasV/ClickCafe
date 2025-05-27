using ClickCafeAPI.Models.MenuModels.CustomizationModels;

namespace ClickCafeAPI.DTOs.MenuDTOs.CustomizationDTOs
{
    public class CreateCustomizationDto
    {
        public string Name { get; set; } = null!;
        public CustomizationType Type { get; set; }
        public List<CreateCustomizationOptionDto> Options { get; set; }
        public IEnumerable<int>? MenuItemIds { get; set; }
    }
}