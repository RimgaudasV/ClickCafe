using ClickCafeAPI.Services.Discount.Interfaces;

namespace ClickCafeAPI.Services.Discount
{
    public class NoDiscountStrategy : IDiscountStrategy
    {
        public decimal ApplyDiscount(decimal totalAmount, string userId) => totalAmount;
    }
}
