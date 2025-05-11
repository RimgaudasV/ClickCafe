using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class CreateOrderWithPaymentDto
    {
        public Guid UserId { get; set; } // Assuming UserId is a Guid
        public DateTime OrderDateTime { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PickupDateTime { get; set; }
        public List<CreateOrderItemDto> Items { get; set; }
        public string PaymentMethod { get; set; } // "Cash" or "CreditCard" (matching enum names)
    }
}