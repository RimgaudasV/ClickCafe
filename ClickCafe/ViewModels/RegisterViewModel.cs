using System.ComponentModel.DataAnnotations;

namespace ClickCafe.ViewModels
{
    public class RegisterViewModel
    {

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        [StringLength(40, MinimumLength = 3)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

    }
}
