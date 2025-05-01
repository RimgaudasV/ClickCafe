using System.ComponentModel.DataAnnotations;

namespace ClickCafe.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public UserRole Role { get; set; }
        public ICollection<Order>? OrderHistory { get; set; }
    }
}
