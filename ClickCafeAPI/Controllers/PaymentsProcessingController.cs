using Microsoft.AspNetCore.Mvc;
using ClickCafeAPI.Context;
using ClickCafeAPI.Models;
using Stripe;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using ClickCafeAPI.DTOs;

namespace ClickCafeAPI.Controllers
{
    [ApiController]
    [ServiceFilter(typeof(LoggingActionFilter))]
    [Route("api/payments")]
    public class PaymentProcessingController : ControllerBase
    {
        private readonly ClickCafeContext _db;
        private readonly IConfiguration _config;

        public PaymentProcessingController(ClickCafeContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
        {
            var payments = await _db.Payments
                .Include(p => p.Order)
                .Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    OrderId = p.OrderId,
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                    PaymentStatus = p.PaymentStatus,
                    PaymentDateTime = p.PaymentDateTime
                })
                .ToListAsync();

            return Ok(payments);
        }

        [HttpPost("{paymentId}/create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent(int paymentId)
        {
            var payment = await _db.Payments.Include(p => p.Order).FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            if (payment == null)
                return NotFound("Payment not found.");

            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(payment.Amount * 100), // convert to cents
                Currency = "eur",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                },
                Metadata = new Dictionary<string, string>
                {
                    { "order_id", payment.OrderId.ToString() },
                    { "payment_id", payment.PaymentId.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            return Ok(new { clientSecret = intent.ClientSecret });
        }

        [HttpPost("{paymentId}/process-card")]
        public async Task<IActionResult> ProcessCardPayment(int paymentId, [FromBody] ProcessCardPaymentDto processDto)
        {
            var payment = await _db.Payments.Include(p => p.Order).FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            if (payment == null) return NotFound("Payment record not found.");

            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(payment.Amount * 100),
                Currency = "eur",
                PaymentMethod = processDto.PaymentMethodId,
                ConfirmationMethod = "automatic",
                Confirm = true,
                ReturnUrl = $"{_config["FrontendBaseUrl"]}/payment-result",
                Metadata = new Dictionary<string, string>
                {
                    { "order_id", payment.OrderId.ToString() },
                    { "payment_id", payment.PaymentId.ToString() }
                }
            };


            var service = new PaymentIntentService();
            try
            {
                var intent = await service.CreateAsync(options);

                if (intent.Status == "succeeded")
                {
                    payment.PaymentStatus = PaymentStatus.Completed;
                    payment.Order.PaymentStatus = OrderPaymentStatus.Paid;
                    await _db.SaveChangesAsync();
                    return Ok(new { success = true, message = "Payment successful" });
                }
                else
                {
                    payment.PaymentStatus = PaymentStatus.Failed;
                    await _db.SaveChangesAsync();
                    return BadRequest(new { success = false, message = $"Payment failed: {intent.LastPaymentError?.Message}" });
                }
            }
            catch (StripeException e)
            {
                payment.PaymentStatus = PaymentStatus.Failed;
                await _db.SaveChangesAsync();
                return StatusCode(500, new { success = false, message = $"Stripe error: {e.Message}" });
            }
            catch (Exception e)
            {
                payment.PaymentStatus = PaymentStatus.Failed;
                await _db.SaveChangesAsync();
                return StatusCode(500, new { success = false, message = $"Internal server error: {e.Message}" });
            }
        }
    }
}