using System;
using System.Collections.Generic;
using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class CreateOrderDto
    {
        public required string UserId { get; set; }
        public DateTime OrderDateTime { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPaymentStatus PaymentStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public int ItemQuantity { get; set; }
        public DateTime PickupDateTime { get; set; }
        public IEnumerable<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    }
}