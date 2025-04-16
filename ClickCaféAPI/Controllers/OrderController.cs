using Microsoft.AspNetCore.Mvc;
using ClickCaféAPI.Context;
using ClickCaféAPI.Models;

namespace ClickCaféAPI.Controllers
{
    [ApiController]
    [Route("api/")]
    public class OrderController : ControllerBase
    {
    
        private readonly ClickCaféContext _context;

        public OrderController(ClickCaféContext context)
        {
            _context = context;
        }

        [HttpGet("orders")]
        public IActionResult GetOrders()
        {
            var orders = _context.Orders.ToList();
            return Ok(orders);
        }
        
        [HttpPost("orders")]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest("Order cannot be null.");
            }

            _context.Orders.Add(order);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }
    }
}
