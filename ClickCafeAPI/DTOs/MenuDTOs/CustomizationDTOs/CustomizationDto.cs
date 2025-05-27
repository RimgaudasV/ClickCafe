using ClickCafeAPI.Models.MenuModels.CustomizationModels;

namespace ClickCafeAPI.DTOs.MenuDTOs.CustomizationDTOs
{
    public class CustomizationDto
    {
        public int CustomizationId { get; set; }
        public string Name { get; set; } = null!;
        public CustomizationType Type { get; set; }
        public IEnumerable<CustomizationOptionDto> Options { get; set; } = new List<CustomizationOptionDto>();
        public IEnumerable<int> MenuItemIds { get; set; } = new List<int>();
    }
}