using ClickCafeAPI.Context;
using ClickCafeAPI.Services.Discount.Interfaces;

namespace ClickCafeAPI.Services.Discount
{
    public class FirstOrderDiscountStrategy : IDiscountStrategy
    {
        private readonly ClickCafeContext _context;
        public FirstOrderDiscountStrategy(ClickCafeContext context) => _context = context;

        public decimal ApplyDiscount(decimal totalAmount, string userId)
        {
            var hasPreviousOrder = _context.Orders.Any(o => o.UserId == userId);
            return hasPreviousOrder ? totalAmount : totalAmount * 0.8m;
        }
    }
}
