using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs;
using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/orders/{orderId}/items")]
    public class OrderItemController : Controller
    {
        private readonly ClickCafeContext _db;
        public OrderItemController(ClickCafeContext db)
           => _db = db;

        // GET: api/orders/{orderId}/items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetAll(int orderId)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Customizations)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return NotFound();

            var items = order.Items.Select(i => new OrderItemDto
            {
                OrderItemId = i.OrderItemId,
                MenuItemId = i.MenuItemId,
                Quantity = i.Quantity,
                Price = i.Price,
                CustomizationIds = i.Customizations.Select(c => c.CustomizationId)
            });

            return Ok(items);
        }

        //// GET: api/orders/{orderId}/items/{itemId}
        //[HttpGet("{itemId}")]
        //public async Task<ActionResult<OrderItemDto>> GetById(int itemId)
        //{
        //    var item = await _db.OrderItems
        //        .Include(i => i.Customizations)
        //        .FirstOrDefaultAsync(i => i.OrderItemId == itemId);

        //    if (item == null) return NotFound();

        //    var orderDto = new OrderItemDto
        //    {
        //        OrderItemId = item.OrderItemId,
        //        MenuItemId = item.MenuItemId,
        //        Quantity = item.Quantity,
        //        Price = item.Price,
        //        CustomizationIds = item.Customizations.Select(c => c.CustomizationId)
        //    };

        //    return Ok(orderDto);
        //}
    }
}
