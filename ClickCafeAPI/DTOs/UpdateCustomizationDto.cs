namespace ClickCafeAPI.DTOs
{
    public class UpdateCustomizationDto
    {
        public int CustomizationId { get; set; }
        public string Name { get; set; } = null!;
        public IEnumerable<string> Options { get; set; } = new List<string>();
        public decimal ExtraCost { get; set; }
        public IEnumerable<int> MenuItemIds { get; set; } = new List<int>();
        public IEnumerable<int> OrderItemIds { get; set; } = new List<int>();
    }
}