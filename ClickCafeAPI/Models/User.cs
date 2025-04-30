using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ClickCafeAPI.Models
{
    public class User : IdentityUser
    {

        [Required]
        public UserRole Role { get; set; }
        public ICollection<Order>? OrderHistory { get; set; }
    }
}
