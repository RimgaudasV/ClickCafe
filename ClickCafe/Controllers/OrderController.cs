using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ClickCafe.Models;
using Microsoft.AspNetCore.Authorization;

namespace ClickCafe.Controllers
{
    public class OrderController : Controller
    {
        private readonly HttpClient _httpClient;

        private readonly ILogger<OrderController> _logger;

        public OrderController(IHttpClientFactory httpClientFactory, ILogger<OrderController> logger)
        {
            _httpClient = httpClientFactory.CreateClient("ClickCafeAPI");
            _logger = logger;

            _logger.LogInformation("HttpClient is using base address: {BaseAddress}", _httpClient.BaseAddress);
        }


        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var apiUrl = "/api/orders";
            var response = await _httpClient.GetAsync(apiUrl);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch orders from API.");
            }

            var orders = await response.Content.ReadAsStringAsync();
            return Content(orders, "application/json");
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            var newOrder = new Order { Id = Guid.NewGuid() };

            var content = new StringContent(JsonSerializer.Serialize(newOrder), Encoding.UTF8, "application/json");


            var response = await _httpClient.PostAsync("api/orders", content);
            if (!response.IsSuccessStatusCode)
                return View("Error", $"API error: {response.StatusCode}");

            return RedirectToAction("Index", "Home");

        }
    }
}