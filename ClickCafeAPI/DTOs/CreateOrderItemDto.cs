namespace ClickCafeAPI.DTOs
{
    public class CreateOrderItemDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public IEnumerable<int>? CustomizationIds { get; set; }
    }
}