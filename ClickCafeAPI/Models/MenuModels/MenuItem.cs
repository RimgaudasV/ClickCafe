﻿using System.ComponentModel.DataAnnotations;
using ClickCafeAPI.Models.CafeModels;
using ClickCafeAPI.Models.MenuModels.CustomizationModels;
using ClickCafeAPI.Models.OrderModels.OrderItemModels;

namespace ClickCafeAPI.Models.MenuModels
{
    public class MenuItem
    {
        public int MenuItemId { get; set; }
        [Required]
        public int CafeId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public decimal BasePrice { get; set; }
        [Required]
        public MenuItemCategory Category { get; set; }
        public string? Image { get; set; }
        public ICollection<Customization> AvailableCustomizations { get; set; }
        public Cafe Cafe { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; } = null!;
    }
}
