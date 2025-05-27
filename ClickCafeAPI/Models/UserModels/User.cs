using System.ComponentModel.DataAnnotations;
using ClickCafeAPI.Models.CafeModels;
using ClickCafeAPI.Models.OrderModels;
using Microsoft.AspNetCore.Identity;

namespace ClickCafeAPI.Models.UserModels
{
    public class User : IdentityUser
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public UserRole Role { get; set; }
        public int? CafeId { get; set; }
        public Cafe Cafe { get; set; }
        public ICollection<Order>? OrderHistory { get; set; }
    }
}
