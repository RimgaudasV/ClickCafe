namespace ClickCafeAPI.DTOs.CafeDTOs
{
    public class UpdateCafeDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string OperatingHours { get; set; }
        public string? Image { get; set; }
    }
}