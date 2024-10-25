using Microsoft.AspNetCore.Identity;

namespace BookStoreAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string UserType { get; set; } // Additional property for user role
    }
}
