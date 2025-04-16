using ClickCaféAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ClickCaféAPI.Context
{
    public class ClickCaféContext : DbContext
    {
        public ClickCaféContext(DbContextOptions<ClickCaféContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
    }
}
