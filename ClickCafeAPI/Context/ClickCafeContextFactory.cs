using ClickCafeAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ClickCafeAPI.Context
{
    public class ClickCafeContextFactory : IDesignTimeDbContextFactory<ClickCafeContext>
    {
        public ClickCafeContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ClickCafeContext>();
            optionsBuilder.UseSqlServer("Server=MSI\\SQLEXPRESS;Database=ClickCafe;Trusted_Connection=True;TrustServerCertificate=True;");

            return new ClickCafeContext(optionsBuilder.Options);
        }
    }
}