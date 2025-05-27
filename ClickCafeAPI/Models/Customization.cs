using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.Models
{
    public class Customization
    {
        public int CustomizationId { get; set; }
        [Required]
        public string Name { get; set; }
        public CustomizationType Type { get; set; }
        public ICollection<CustomizationOption> Options { get; set; }
        public ICollection<MenuItem> MenuItems { get; set; }
    }
}
