using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookStoreAPI.Data;
using BookStoreAPI.Models; 
using BookStoreAPI.Models.DTOs;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBooks()
    {
        try
        {
            var books = _context.Books
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    CoverImage = b.CoverImage,
                    Publisher = b.Publisher,
                    PublicationDate = b.PublicationDate,
                    Category = b.Category,
                    ISBN = b.ISBN,
                    PageCount = b.PageCount,
                    IsAvailable = b.IsAvailable,
                    CheckedOutDate = b.CheckedOutDate,
                    ReturnDate = b.ReturnDate,
                    AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0
                })
                .ToList();

            if (books == null || !books.Any())
            {
                return NotFound("No books found.");
            }

            return Ok(books);
        }
        catch (Exception ex)
        {
            // Log the exception (you can use any logging framework)
            Console.Error.WriteLine($"Error retrieving books: {ex.Message}");

            // Return a generic error response
            return StatusCode(500, "Internal server error. Please try again later.");
        }
    }

    [HttpGet("featured")]
    public IActionResult GetFeaturedBooks()
    {
        try
        {
            var featuredBooks = _context.Books
                .OrderBy(b => Guid.NewGuid()) // Randomly order books
                .Take(10) // Limit to 10 featured books
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Description,
                    b.CoverImage,
                    b.IsAvailable,
                    b.Category,
                    AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0
                })
                .ToList();

            if (featuredBooks == null || !featuredBooks.Any())
            {
                return NotFound("No featured books found.");
            }

            return Ok(featuredBooks);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving featured books: {ex.Message}");

            // Return a generic error response
            return StatusCode(500, "Internal server error. Please try again later.");
        }
    }

    [HttpGet("checkedout")]
    [Authorize(Roles = "Librarian")] // Only allow librarians to view checked out books
    public IActionResult GetCheckedOutBooks()
    {
        try
        {
            var checkedOutBooks = _context.Books
                .Where(b => b.IsAvailable == false)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Description,
                    b.CoverImage,
                    b.CheckedOutDate,
                    b.ReturnDate
                })
                .ToList();

            if (checkedOutBooks == null || !checkedOutBooks.Any())
            {
                return NotFound("No checked out books found.");
            }

            return Ok(checkedOutBooks);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving featured books: {ex.Message}");

            // Return a generic error response
            return StatusCode(500, "Internal server error. Please try again later.");
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetBookDetails(int id)
    {
        var book = _context.Books
            .Where(b => b.Id == id)
            .Select(b => new {
                b.Title,
                b.Author,
                b.Description,
                b.CoverImage,
                b.Publisher,
                b.PublicationDate,
                b.Category,
                b.ISBN,
                b.PageCount,
                b.IsAvailable,
                b.CheckedOutDate,
                b.ReturnDate,
                Reviews = b.Reviews.Select(r => new {
                    r.Message,
                    r.Rating
                }).ToList(),
                AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0
            })
            .FirstOrDefault();

        if (book == null)
            return NotFound();

        return Ok(book);
    }

    [HttpGet("search")]
    public IActionResult SearchBooks([FromQuery] string query)
    {
        var books = _context.Books
            .Where(b => b.Title.Contains(query))
            .ToList();

        return Ok(books);
    }

    [HttpPost]
    [Authorize(Roles = "Librarian")] // Only allow librarians to add books
    public IActionResult CreateBook([FromBody] Book book)
    {
        Console.WriteLine("here");
        try
        {
            _context.Books.Add(book);
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            // Log the exception (you can use any logging framework)
            Console.Error.WriteLine($"Error retrieving featured books: {ex.Message}");

            // Return a generic error response
            return StatusCode(500, "Internal server error. Please try again later.");
        }
        return CreatedAtAction(nameof(GetBookDetails), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")] // Only allow librarians to update books
    public IActionResult UpdateBook(int id, [FromBody] Book book)
    {
        var existingBook = _context.Books.Find(id);
        if (existingBook == null)
            return NotFound();

        existingBook.Title = book.Title;
        existingBook.Author = book.Author;
        existingBook.Description = book.Description; // Ensure you're updating all necessary fields
        existingBook.Publisher = book.Publisher;
        existingBook.PublicationDate = book.PublicationDate;
        existingBook.Category = book.Category;
        existingBook.ISBN = book.ISBN;
        existingBook.PageCount = book.PageCount;

        _context.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")] // Only allow librarians to delete books
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null)
            return NotFound();

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }

    [HttpPost("{id}/checkout")]
    [Authorize(Roles = "Customer")] // Only allow customers to check out books
    public IActionResult CheckoutBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null || book.IsAvailable == false)
            return BadRequest("Book not available for checkout.");

        book.IsAvailable = false; // Mark book as checked out
        book.CheckedOutDate = DateTime.UtcNow; // Track checkout date
        book.ReturnDate = DateTime.UtcNow.AddDays(5); // Set return date to 5 days later
        _context.SaveChanges();

        return Ok("Book checked out successfully.");
    }

    [HttpPost("{id}/return")]
    [Authorize(Roles = "Librarian")] // Only allow librarians to return books
    public IActionResult ReturnBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null)
            return NotFound();

        book.IsAvailable = true; // Mark book as available
        book.CheckedOutDate = null; // Clear checkout date
        book.ReturnDate = null; // Clear return date
        _context.SaveChanges();

        return Ok("Book returned successfully.");
    }

    [HttpPost("{id}/reviews")]
    [Authorize(Roles = "Customer")] // Only allow customers to leave reviews
    public IActionResult LeaveReview(int id, [FromBody] ReviewDto reviewDto)
    {
        Console.WriteLine("we here");

        Review review = new Review
        {
            Message = reviewDto.Review,
            Rating = reviewDto.Rating,
            BookId = id 
        };
        // Add the review to the book
        review.BookId = id; 
        _context.Reviews.Add(review);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetBookDetails), new { id }, review);
    }
}