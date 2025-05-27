using System.ComponentModel.DataAnnotations;
using ClickCafeAPI.Models.MenuModels;

namespace ClickCafeAPI.Models.OrderModels.OrderItemModels
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        [Required]
        public int MenuItemId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Price { get; set; }
        public MenuItem MenuItem { get; set; }
        public ICollection<OrderItemCustomizationOption> SelectedOptions { get; set; } = new List<OrderItemCustomizationOption>();
    }
}
