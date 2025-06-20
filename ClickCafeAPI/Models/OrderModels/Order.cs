﻿using System.ComponentModel.DataAnnotations;
using ClickCafeAPI.Models.CafeModels;
using ClickCafeAPI.Models.OrderModels.OrderItemModels;
using ClickCafeAPI.Models.UserModels;

namespace ClickCafeAPI.Models.OrderModels
{
    public class Order
    {
        public int OrderId { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public DateTime OrderDateTime { get; set; }
        [Required]
        public OrderStatus Status { get; set; }
        [Required]
        public OrderPaymentStatus PaymentStatus { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }
        [Required]
        public int ItemQuantity { get; set; }
        [Required]
        public DateTime PickupDateTime { get; set; }
        public ICollection<OrderItem> Items { get; set; }
        public User User { get; set; }
        public int CafeId { get; set; }
        public Cafe Cafe { get; set; }

    }
}
