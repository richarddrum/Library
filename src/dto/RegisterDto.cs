namespace BookStoreAPI.Models.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; } // Specifies the type of user: Librarian or Customer
    }
}