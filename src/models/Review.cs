using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreAPI.Models
{
    public class Review
    {
        public int Id { get; set; } // Unique identifier for the review

        [Required]
        public int BookId { get; set; } // Foreign key for the book being reviewed

        [Required]
        [StringLength(1000)]
        public string Message { get; set; } = string.Empty;// The review message

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; } // Rating from 1 to 5 stars

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp for when the review was created
    }
}
