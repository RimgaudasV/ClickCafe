using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;
using ClickCafeAPI.Models;
using ClickCafeAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [Route("api/")]
    public class OrderController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        public OrderController(ClickCafeContext db)
           => _db = db;

        // GET: api/orders
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            var orders = await _db.Orders.Include(o => o.Items).ToListAsync();

            var dto = orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                UserId = int.Parse(o.UserId),
                OrderDateTime = o.OrderDateTime,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                TotalAmount = o.TotalAmount,
                PickupDateTime = o.PickupDateTime,
                OrderItemIds = o.Items.Select(i => i.OrderItemId)
            });

            return Ok(dto);
        }

        // GET: api/orders/{id}
        [HttpGet("orders/{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return NotFound();

            var dto = new OrderDto
            {
                OrderId = order.OrderId,
                UserId = int.Parse(order.UserId),
                OrderDateTime = order.OrderDateTime,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                TotalAmount = order.TotalAmount,
                PickupDateTime = order.PickupDateTime,
                OrderItemIds = order.Items.Select(i => i.OrderItemId)
            };

            return dto;
        }

        // POST: api/orders
        [HttpPost("orders")]
        public async Task<ActionResult<OrderDto>> Create(CreateOrderDto createDto)
        {
            var order = new Order
            {
                UserId = createDto.UserId.ToString(),
                OrderDateTime = createDto.OrderDateTime,
                Status = createDto.Status,
                PaymentStatus = createDto.PaymentStatus,
                TotalAmount = createDto.TotalAmount,
                PickupDateTime = createDto.PickupDateTime,
                Items = new List<OrderItem>()
            };

            foreach (var itemDto in createDto.Items)
            {
                var menuItem = await _db.MenuItems.FindAsync(itemDto.MenuItemId);
                if (menuItem == null)
                {
                    return BadRequest($"MenuItem with ID {itemDto.MenuItemId} not found.");
                }

                var orderItem = new OrderItem
                {
                    MenuItemId = itemDto.MenuItemId,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    Customizations = new List<Customization>()
                };

                if (itemDto.CustomizationIds != null)
                {
                    var customizations = await _db.Customizations
                        .Where(c => itemDto.CustomizationIds.Contains(c.CustomizationId))
                        .ToListAsync();

                    orderItem.Customizations = customizations;
                }

                order.Items.Add(orderItem);
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var dto = new OrderDto
            {
                OrderId = order.OrderId,
                UserId = int.Parse(order.UserId),
                OrderDateTime = order.OrderDateTime,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                TotalAmount = order.TotalAmount,
                PickupDateTime = order.PickupDateTime,
                OrderItemIds = order.Items.Select(i => i.OrderItemId)
            };

            return CreatedAtAction(nameof(GetById), new { id = dto.OrderId }, dto);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateOrderDto dto)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.Customizations)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return NotFound();

            order.Status = dto.Status;
            order.PaymentStatus = dto.PaymentStatus;
            order.TotalAmount = dto.TotalAmount;
            order.PickupDateTime = dto.PickupDateTime;
            order.OrderDateTime = dto.OrderDateTime;

            _db.OrderItems.RemoveRange(order.Items);
            order.Items = new List<OrderItem>();

            foreach (var itemDto in dto.Items)
            {
                var menuItem = await _db.MenuItems.FindAsync(itemDto.MenuItemId);
                if (menuItem == null) return BadRequest($"MenuItem ID {itemDto.MenuItemId} not found.");

                var orderItem = new OrderItem
                {
                    MenuItemId = itemDto.MenuItemId,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    Customizations = new List<Customization>()
                };

                if (itemDto.CustomizationIds != null)
                {
                    var customizations = await _db.Customizations
                        .Where(c => itemDto.CustomizationIds.Contains(c.CustomizationId))
                        .ToListAsync();

                    orderItem.Customizations = customizations;
                }

                order.Items.Add(orderItem);
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return NotFound();

            _db.Orders.Remove(order);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
