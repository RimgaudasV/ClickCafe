using System;
using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.Models
{
    public class OrderAlert
    {
        public int Id { get; set; }
        [Required] public string UserId { get; set; } = null!;
        public int OrderId { get; set; }
        [Required] public string Text { get; set; } = null!;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    }
}
