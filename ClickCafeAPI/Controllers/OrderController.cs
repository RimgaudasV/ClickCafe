using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;
using ClickCafeAPI.Models;
using ClickCafeAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
                UserId = o.UserId,
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
                UserId = order.UserId,
                OrderDateTime = order.OrderDateTime,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                TotalAmount = order.TotalAmount,
                PickupDateTime = order.PickupDateTime,
                OrderItemIds = order.Items.Select(i => i.OrderItemId)
            };

            return dto;
        }

        // GET: api/userOrders
        [HttpGet("userOrders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetCurrentUserOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User not authorized");

            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ToListAsync();

            var dto = orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDateTime = o.OrderDateTime,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                TotalAmount = o.TotalAmount,
                PickupDateTime = o.PickupDateTime,
                OrderItemIds = o.Items.Select(i => i.OrderItemId)
            });

            return Ok(dto);
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

            decimal totalAmount = 0;

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
                    Price = menuItem.BasePrice,
                    Customizations = new List<Customization>()
                };

                if (itemDto.CustomizationIds != null)
                {
                    var customizations = await _db.Customizations
                        .Include(c => c.Options)
                        .Where(c => itemDto.CustomizationIds.Contains(c.CustomizationId))
                        .ToListAsync();

                    orderItem.Customizations = customizations;

                    decimal customizationCost = customizations
                        .SelectMany(c => c.Options)
                        .Sum(opt => opt.ExtraCost);
                    orderItem.Price += customizationCost; // Add customization cost to item price
                    orderItem.Customizations = customizations;
                }

                order.Items.Add(orderItem);
                totalAmount += orderItem.Price * orderItem.Quantity;
            }

            order.TotalAmount = totalAmount;

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var dto = new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
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
        public async Task<IActionResult> Update(int id, UpdateOrderDto updateDto)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.Customizations)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return NotFound();

            if (order.Status != default) order.Status = updateDto.Status;
            if (order.PaymentStatus != default) order.PaymentStatus = updateDto.PaymentStatus;
            if (updateDto.TotalAmount != default) order.TotalAmount = updateDto.TotalAmount;
            if (updateDto.PickupDateTime != default) order.PickupDateTime = updateDto.PickupDateTime;
            if (updateDto.OrderDateTime != default) order.OrderDateTime = updateDto.OrderDateTime;

            if (updateDto.ItemsToAdd != null)
            {
                foreach (var itemDto in updateDto.ItemsToAdd)
                {
                    var menuItem = await _db.MenuItems.FindAsync(itemDto.MenuItemId);
                    if (menuItem == null) return BadRequest($"MenuItem with ID {itemDto.MenuItemId} not found.");

                    var orderItem = new OrderItem
                    {
                        MenuItemId = itemDto.MenuItemId,
                        Quantity = itemDto.Quantity,
                        Price = menuItem.BasePrice,
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
            }

            decimal totalAmount = 0;
            foreach (var item in order.Items)
            {
                totalAmount += item.Price * item.Quantity;
            }
            order.TotalAmount = totalAmount;

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
