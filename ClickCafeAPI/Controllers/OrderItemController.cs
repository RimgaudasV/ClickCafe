using ClickCafeAPI.Context;
using ClickCafeAPI.DTOs.OrderDTOs.OrderItemDTOs;
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
                .ThenInclude(i => i.SelectedOptions)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return NotFound();

            var items = order.Items.Select(i => new OrderItemDto
            {
                OrderItemId = i.OrderItemId,
                MenuItemId = i.MenuItemId,
                Quantity = i.Quantity,
                Price = i.Price,
                SelectedOptionIds = i.SelectedOptions.Select(c => c.CustomizationOptionId)
            });

            return Ok(items);
        }

        // GET: api/orders/{orderId}/items/{itemId}
        [HttpGet("{itemId}")]
        public async Task<ActionResult<OrderItemDto>> GetById(int itemId)
        {
            var item = await _db.OrderItems
                .Include(i => i.MenuItem)
                .Include(i => i.SelectedOptions)
                .FirstOrDefaultAsync(i => i.OrderItemId == itemId);

            if (item == null) return NotFound();

            var orderItemDto = new OrderItemDto
            {
                OrderItemId = item.OrderItemId,
                MenuItemId = item.MenuItemId,
                Quantity = item.Quantity,
                Price = item.Price,
                SelectedOptionIds = item.SelectedOptions.Select(c => c.CustomizationOptionId)
            };

            return Ok(orderItemDto);
        }
    }
}
