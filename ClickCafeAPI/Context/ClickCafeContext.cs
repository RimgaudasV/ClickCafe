using ClickCafeAPI.Models.CafeModels;
using ClickCafeAPI.Models.MenuModels;
using ClickCafeAPI.Models.MenuModels.CustomizationModels;
using ClickCafeAPI.Models.OrderModels;
using ClickCafeAPI.Models.OrderModels.OrderItemModels;
using ClickCafeAPI.Models.PaymentModels;
using ClickCafeAPI.Models.UserModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Context
{
    public class ClickCafeContext : IdentityDbContext<User, IdentityRole, string>
    {
        public ClickCafeContext(DbContextOptions<ClickCafeContext> options) :
            base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderAlert> OrderAlerts { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<CustomizationOption> CustomizationOptions { get; set; }
        public DbSet<Customization> Customizations { get; set; }
        public DbSet<Cafe> Cafes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<OrderItemCustomizationOption> OrderItemCustomizationOptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.MenuItem)
                .WithMany(mi => mi.OrderItems)
                .HasForeignKey(oi => oi.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItemCustomizationOption>()
                .HasKey(x => new { x.OrderItemId, x.CustomizationOptionId });

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.OrderHistory)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.Cafe)
                .WithMany(c => c.MenuItems)
                .HasForeignKey(mi => mi.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItem>()
                .HasMany(mi => mi.AvailableCustomizations)
                .WithMany(c => c.MenuItems)
                .UsingEntity(j => j.ToTable("MenuItemCustomizations"));

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithOne()
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .Property(o => o.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.CafeId)
                .IsRequired(false);

            modelBuilder.Entity<MenuItem>()
                .Property(mi => mi.Category)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Cafe)
                .WithMany()
                .HasForeignKey(u => u.CafeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
