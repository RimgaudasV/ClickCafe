﻿using System;
using System.Collections.Generic;
using ClickCafeAPI.DTOs.OrderDTOs.OrderItemDTOs;
using ClickCafeAPI.Models.OrderModels;

namespace ClickCafeAPI.DTOs.OrderDTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public required string UserId { get; set; }
        public int CafeId { get; set; }
        public string UserName { get; set; }
        public DateTime OrderDateTime { get; set; }
        public OrderStatus Status { get; set; }
        public OrderPaymentStatus PaymentStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public int ItemQuantity { get; set; }
        public DateTime PickupDateTime { get; set; }
        public IEnumerable<int> OrderItemIds { get; set; } = new List<int>();
        public IEnumerable<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();

    }
}