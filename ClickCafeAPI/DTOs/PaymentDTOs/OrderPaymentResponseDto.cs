namespace ClickCafeAPI.DTOs.PaymentDTOs
{
    public class OrderPaymentResponseDto
    {
        public int OrderId { get; set; }
        public int PaymentId { get; set; }
        public decimal TotalAmount { get; set; }
    }
}