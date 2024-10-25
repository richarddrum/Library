using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookStoreAPI.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(100)]
        public string Author { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(250)]
        public string CoverImage { get; set; } // URL or path to cover image

        [Required]
        [StringLength(100)]
        public string Publisher { get; set; }

        [Required]
        public DateTime PublicationDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; }

        [Required]
        [StringLength(20)]
        public string ISBN { get; set; } // International Standard Book Number

        public int PageCount { get; set; }

        public bool IsAvailable { get; set; } // Availability status

        public DateTime? CheckedOutDate { get; set; } // Track when the book was checked out

        public DateTime? ReturnDate { get; set; } // Track when the book is due to be returned

        // Navigation property for reviews
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
