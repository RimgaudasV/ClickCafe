using ClickCafeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Context
{
    public class ClickCafeContext : DbContext
    {
        public ClickCafeContext(DbContextOptions<ClickCafeContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
    }
}
