namespace ClickCafeAPI.Services.Discount.Interfaces
{
    public interface IDiscountService
    {
        decimal CalculateDiscountedTotal(decimal total, string userId);
    }
}
