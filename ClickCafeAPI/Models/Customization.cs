using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.Models
{
    public class Customization
    {
        public int CustomizationId { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<string> Options { get; set; }
        public decimal ExtraCost { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<MenuItem> MenuItems { get; set; }
    }
}
