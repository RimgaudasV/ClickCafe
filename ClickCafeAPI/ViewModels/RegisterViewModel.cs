using ClickCafeAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace ClickCafeAPI.ViewModels
{
    public class RegisterViewModel
    {

        [Required(ErrorMessage = "Username is required.")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        [StringLength(40, MinimumLength = 3)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required(ErrorMessage = "Role is required.")]
        public UserRole Role { get; set; }

    }
}
