namespace ClickCafeAPI.Services.Discount.Interfaces
{
    public interface IDiscountStrategy
    {
        decimal ApplyDiscount(decimal totalAmount, string userId);
    }

}
