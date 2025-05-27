using ClickCafeAPI.DTOs.OrderDTOs.OrderItemDTOs;
using ClickCafeAPI.Models.OrderModels;

namespace ClickCafeAPI.DTOs.OrderDTOs
{
    public class UpdateOrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDateTime { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPaymentStatus PaymentStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public int ItemQuantity { get; set; }
        public DateTime PickupDateTime { get; set; }
        public IEnumerable<int> OrderItemIds { get; set; } = new List<int>();
        public IEnumerable<CreateOrderItemDto> ItemsToAdd { get; set; } = new List<CreateOrderItemDto>();
    }
}