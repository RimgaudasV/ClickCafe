using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class UpdateCustomizationOptionDto
    {
        public int CustomizationOptionId { get; set; }
        public string Name { get; set; }
        public decimal ExtraCost { get; set; }
    }
}
