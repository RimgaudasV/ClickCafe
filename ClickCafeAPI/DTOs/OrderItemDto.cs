using System.Collections.Generic;

namespace ClickCafeAPI.DTOs
{
    public class OrderItemDto
    {
        public int OrderItemId { get; set; }
        public int MenuItemId { get; set; }
        public string MenuItemName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public IEnumerable<int> SelectedOptionIds { get; set; } = new List<int>();
    }
}