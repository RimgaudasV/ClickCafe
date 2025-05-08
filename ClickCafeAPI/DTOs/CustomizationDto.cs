using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class CustomizationDto
    {
        public int CustomizationId { get; set; }
        public string Name { get; set; } = null!;
        public CustomizationType Type { get; set; }
        public IEnumerable<int> OptionIds { get; set; } = new List<int>();
        public IEnumerable<int> MenuItemIds { get; set; } = new List<int>();
        public IEnumerable<int> OrderItemIds { get; set; } = new List<int>();
    }
}