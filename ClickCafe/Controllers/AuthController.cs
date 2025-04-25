using ClickCafe.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

public class AuthController : Controller
{
    private readonly HttpClient _httpClient;

    public AuthController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("ClickCafeAPI");
    }

    [HttpGet]
    public IActionResult Login() => View();

    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        var apiUrl = "/api/auth/login";
        var response = await _httpClient.PostAsJsonAsync(apiUrl, model);


        if (response.IsSuccessStatusCode)
        {
            return RedirectToAction("Index", "Home");
        }

        ModelState.AddModelError("", "Invalid credentials");
        return View(model);
    }


    [HttpGet]
    public IActionResult Register() => View();

    [HttpPost]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        var apiUrl = "/api/auth/register";
        var response = await _httpClient.PostAsJsonAsync(apiUrl, model);

        if (response.IsSuccessStatusCode)
        {
            TempData["Success"] = "Registration successful!";
            return RedirectToAction("Login");
        }

        ModelState.AddModelError("", "Registration failed");
        return View(model);
    }
}
