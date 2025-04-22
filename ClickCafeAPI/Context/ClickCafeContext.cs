using ClickCafeAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Context
{
    public class ClickCafeContext : IdentityDbContext<User>
    {
        public ClickCafeContext(DbContextOptions<ClickCafeContext> options) :
            base(options){ }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        }
    }
}
