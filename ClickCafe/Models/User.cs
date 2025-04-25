using System.ComponentModel.DataAnnotations;
﻿using Microsoft.AspNetCore.Identity;

namespace ClickCafe.Models
{
    public class User : IdentityUser
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
