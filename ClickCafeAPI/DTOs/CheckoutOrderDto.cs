using ClickCafeAPI.Models;

namespace ClickCafeAPI.DTOs
{
    public class CheckoutOrderDto
    {
        public DateTime PickupTime { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}