using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        [Required]
        public int MenuItemId { get; set; }
        [Required]
        public int Quantity { get; set; }
        public ICollection<Customization> Customizations { get; set; }
        [Required]
        public decimal Price { get; set; }
        public MenuItem MenuItem { get; set; }
    }
}
