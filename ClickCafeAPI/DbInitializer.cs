using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Identity;

public static class DbInitializer
{
    public static async Task SeedAdminAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var adminEmail = "admin@clickcafe.com";

        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                DisplayName = "Admin",
                Role = UserRole.Admin,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(admin, "admin@123");
        }
    }
}
