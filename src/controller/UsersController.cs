using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BookStoreAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookStoreAPI.Models.DTOs;

namespace BookStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public UsersController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            Console.WriteLine("here");
            if (registerDto == null)
            {
                return BadRequest("Register data cannot be null.");
            }

            var user = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                UserType = registerDto.UserType
            };
            
            try
            {
                // Create the user and set the password
                var result = await _userManager.CreateAsync(user, registerDto.Password);

                if (!result.Succeeded)
                {
                    // Create a list to hold specific error messages
                    var errors = new List<string>();

                    foreach (var error in result.Errors)
                    {
                        // Check the error code and return specific messages
                        switch (error.Code)
                        {
                            case "DuplicateUserName":
                                errors.Add("Username already exists.");
                                break;
                            case "DuplicateEmail":
                                errors.Add("Email already exists.");
                                break;
                            case "PasswordTooShort":
                                errors.Add("Password must be at least 6 characters long.");
                                break;
                            case "PasswordRequiresUpper":
                                errors.Add("Password must contain at least one uppercase letter.");
                                break;
                            case "PasswordRequiresLower":
                                errors.Add("Password must contain at least one lowercase letter.");
                                break;
                            case "PasswordRequiresDigit":
                                errors.Add("Password must contain at least one digit.");
                                break;
                            case "PasswordRequiresNonAlphanumeric":
                                errors.Add("Password must contain at least one non-alphanumeric character.");
                                break;
                            default:
                                errors.Add(error.Description);
                                break;
                        }
                    }
                    return BadRequest(new { errors }); // Return the list of error messages
                }
                // Assign role to the user
                // Assuming the role is determined by the UserType or is hardcoded
                var role = registerDto.UserType == "Librarian" ? "Librarian" : "Customer";
                await _userManager.AddToRoleAsync(user, role);

                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                // Log the exception (use your logging framework of choice)
                Console.WriteLine($"Error during registration: {ex.Message}");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName); // Use FindByNameAsync
            if (user == null)
                return Unauthorized(new { message = "Invalid login attempt." });

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result)
                return Unauthorized(new { message = "Invalid login attempt." });

            var token = await GenerateJwtToken(user);
            return Ok(new TokenDto { Token = token, Expiration = DateTime.UtcNow.AddHours(1) });
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            Console.WriteLine("making token");
            var roles = await _userManager.GetRolesAsync(user); // Fetch roles from UserManager
            Console.WriteLine($"User roles: {string.Join(", ", roles)}");

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userType", user.UserType)
            };

            // Add each role as a claim
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
