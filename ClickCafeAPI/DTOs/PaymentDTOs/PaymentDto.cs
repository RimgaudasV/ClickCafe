using System;
using ClickCafeAPI.Models.PaymentModels;

namespace ClickCafeAPI.DTOs.PaymentDTOs
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateTime PaymentDateTime { get; set; }
    }
}