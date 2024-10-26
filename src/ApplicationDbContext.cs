using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BookStoreAPI.Models;
using Microsoft.AspNetCore.Identity; // Ensure this is the correct namespace for your models

namespace BookStoreAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet for Books
        public DbSet<Book> Books { get; set; }

        // DbSet for Reviews
        public DbSet<Review> Reviews { get; set; } // Add this line

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure relationships if needed
            modelBuilder.Entity<Review>()
                .HasOne<Book>()
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BookId);
        }
    }
}
