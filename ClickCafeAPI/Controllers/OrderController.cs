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
                ItemQuantity = o.ItemQuantity,
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
                ItemQuantity = order.ItemQuantity,
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
                ItemQuantity = o.ItemQuantity,
                PickupDateTime = o.PickupDateTime,
                OrderItemIds = o.Items.Select(i => i.OrderItemId)
            });

            return Ok(dto);
        }


        [HttpPost("orders")]
        public async Task<ActionResult<OrderPaymentResponseDto>> CreateOrderWithPayment(CreateOrderWithPaymentDto createDto)
        {
            var firstMenuItem = await _db.MenuItems.FindAsync(createDto.Items.First().MenuItemId);
            if (firstMenuItem == null)
                return BadRequest("MenuItem not found.");

            var order = new Order
            {
                UserId = createDto.UserId.ToString(),
                CafeId = firstMenuItem.CafeId,
                OrderDateTime = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                PaymentStatus = OrderPaymentStatus.Unpaid,
                TotalAmount = createDto.TotalAmount,
                ItemQuantity = createDto.ItemQuantity,
                PickupDateTime = createDto.PickupDateTime,
                Items = new List<OrderItem>()
            };

            var customizationMap = new Dictionary<int, List<int>>();

            foreach (var itemDto in createDto.Items)
            {
                var menuItem = await _db.MenuItems.FindAsync(itemDto.MenuItemId);
                if (menuItem == null)
                    return BadRequest($"MenuItem with ID {itemDto.MenuItemId} not found.");

                var selectedOptionIds = itemDto.SelectedOptionIds ?? new List<int>();

                var selectedOptions = await _db.CustomizationOptions
                    .Where(opt => selectedOptionIds.Contains(opt.CustomizationOptionId))
                    .ToListAsync();

                var extraCostPerUnit = selectedOptions.Sum(opt => opt.ExtraCost);

                var orderItem = new OrderItem
                {
                    MenuItemId = itemDto.MenuItemId,
                    Quantity = itemDto.Quantity,
                    Price = menuItem.BasePrice + extraCostPerUnit
                };

                order.Items.Add(orderItem);
                customizationMap[orderItem.GetHashCode()] = (List<int>)selectedOptionIds;

                order.ItemQuantity += orderItem.Quantity;
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            foreach (var orderItem in order.Items)
            {
                var optionIds = customizationMap[orderItem.GetHashCode()];

                foreach (var optionId in optionIds)
                {
                    _db.OrderItemCustomizationOptions.Add(new OrderItemCustomizationOption
                    {
                        OrderItemId = orderItem.OrderItemId,
                        CustomizationOptionId = optionId
                    });
                }
            }

            await _db.SaveChangesAsync();

            var payment = new Payment
            {
                OrderId = order.OrderId,
                Amount = order.TotalAmount,
                PaymentMethod = Enum.Parse<PaymentMethod>(createDto.PaymentMethod, true),
                PaymentStatus = PaymentStatus.Pending,
                PaymentDateTime = DateTime.UtcNow
            };

            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            var responseDto = new OrderPaymentResponseDto
            {
                OrderId = order.OrderId,
                PaymentId = payment.PaymentId
            };

            return CreatedAtAction(nameof(GetById), new { id = order.OrderId }, responseDto);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateOrderDto updateDto)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.SelectedOptions)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return NotFound();

            if (order.Status != default) order.Status = updateDto.Status;
            if (order.PaymentStatus != default) order.PaymentStatus = updateDto.PaymentStatus;
            if (updateDto.TotalAmount != default) order.TotalAmount = updateDto.TotalAmount;
            if (updateDto.ItemQuantity != default) order.ItemQuantity = updateDto.ItemQuantity;
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
                        SelectedOptions = new List<OrderItemCustomizationOption>()
                    };

                    if (itemDto.SelectedOptionIds != null)
                    {
                        var selectedOptions = await _db.OrderItemCustomizationOptions
                            .Where(c => itemDto.SelectedOptionIds.Contains(c.CustomizationOptionId))
                            .ToListAsync();
                        orderItem.SelectedOptions = selectedOptions;
                    }
                    order.Items.Add(orderItem);
                }
            }

            decimal totalAmount = 0;
            int itemQuantity = 0;
            foreach (var item in order.Items)
            {
                totalAmount += item.Price * item.Quantity;
                itemQuantity += item.Quantity;
            }
            order.TotalAmount = totalAmount;
            order.ItemQuantity = itemQuantity;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orders/{id}
        [HttpDelete("orders/{id}")]
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

        // PATCH: api/orders/{id}/status
        [HttpPatch("orders/{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderDto dto)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("orders/{orderId}/pay-cash")]
        public async Task<IActionResult> PayOrderCash(int orderId)
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            order.PaymentStatus = OrderPaymentStatus.Paid;
            var payment = await _db.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId);
            if (payment != null)
            {
                payment.PaymentStatus = PaymentStatus.Completed;
                await _db.SaveChangesAsync();
                return Ok(new { message = "Cash payment confirmed." });
            }
            return NotFound("Payment record not found for this order.");
        }
    }
}