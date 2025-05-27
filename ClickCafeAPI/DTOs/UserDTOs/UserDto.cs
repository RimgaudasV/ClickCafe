using System.Collections.Generic;
using ClickCafeAPI.Models.UserModels;

namespace ClickCafeAPI.DTOs.UserDTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public UserRole Role { get; set; }
        public IEnumerable<int> OrderHistoryIds { get; set; } = new List<int>();
    }
}
