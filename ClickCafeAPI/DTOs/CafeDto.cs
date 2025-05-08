namespace ClickCafeAPI.DTOs
{
    public class CafeDto
    {
        public int CafeId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string OperatingHours { get; set; } = null!;
        public string? Image { get; set; }
        public IEnumerable<int> MenuItemIds { get; set; } = new List<int>();
    }
}