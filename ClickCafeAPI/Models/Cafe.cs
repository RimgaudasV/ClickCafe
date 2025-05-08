using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.Models
{
    public class Cafe
    {
        public int CafeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string OperatingHours { get; set; }
        public string? Image { get; set; }
        public ICollection<MenuItem> MenuItems { get; set; }
    }
}
