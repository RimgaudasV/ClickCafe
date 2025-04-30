namespace ClickCafeAPI.DTOs
{
    public class CreateCustomizationDto
    {
        public string Name { get; set; } = null!;
        public IEnumerable<string>? Options { get; set; }
        public decimal ExtraCost { get; set; }
        public IEnumerable<int>? MenuItemIds { get; set; }
    }
}