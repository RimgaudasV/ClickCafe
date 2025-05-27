using ClickCafeAPI.Services.Discount.Interfaces;

namespace ClickCafeAPI.Services.Discount
{
    public class DiscountService : IDiscountService
    {
        private readonly IDiscountStrategy _strategy;

        public DiscountService(IDiscountStrategy strategy)
        {
            _strategy = strategy;
        }

        public decimal CalculateDiscountedTotal(decimal total, string userId)
            => _strategy.ApplyDiscount(total, userId);
    }
}
