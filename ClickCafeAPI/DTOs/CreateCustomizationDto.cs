using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class CreateCustomizationDto
    {
        public string Name { get; set; } = null!;
        public CustomizationType Type { get; set; }
        public IEnumerable<int> OptionIds { get; set; }
        public IEnumerable<int>? MenuItemIds { get; set; }
    }
}