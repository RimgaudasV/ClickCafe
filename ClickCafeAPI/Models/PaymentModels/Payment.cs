using System.ComponentModel.DataAnnotations;
using ClickCafeAPI.Models.OrderModels;

namespace ClickCafeAPI.Models.PaymentModels
{
    public class Payment
    {
        public int PaymentId { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public PaymentMethod PaymentMethod { get; set; }
        [Required]
        public PaymentStatus PaymentStatus { get; set; }
        [Required]
        public DateTime PaymentDateTime { get; set; }
        public Order Order { get; set; }
    }
}
