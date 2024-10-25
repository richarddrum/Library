using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookStoreAPI.Data;
using BookStoreAPI.Models; // Assuming you have a Models namespace for your entities
using System.Linq;

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
                .Select(b => new Book
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
                    ReturnDate = b.ReturnDate
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
                    b.Title,
                    b.Author,
                    b.Description,
                    b.CoverImage,
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
            // Log the exception (you can use any logging framework)
            Console.Error.WriteLine($"Error retrieving featured books: {ex.Message}");

            // Return a generic error response
            return StatusCode(500, "Internal server error. Please try again later.");
        }
    }

    // iii. View Book Details
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
                Reviews = b.Reviews.Select(r => new {
                    r.Message,
                    r.Rating
                }).ToList()
            })
            .FirstOrDefault();

        if (book == null)
            return NotFound();

        return Ok(book);
    }

    // iv. Search For Books
    [HttpGet("search")]
    public IActionResult SearchBooks([FromQuery] string query)
    {
        var books = _context.Books
            .Where(b => b.Title.Contains(query))
            .ToList();

        return Ok(books);
    }

    // v. Manage Books
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

    // vi. Book Checkout
    [HttpPost("{id}/checkout")]
    [Authorize(Roles = "Customer")] // Only allow customers to check out books
    public IActionResult CheckoutBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null || book.IsAvailable == false) // Assuming an IsAvailable property
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

    // vii. Customer Reviews
    [HttpPost("{id}/reviews")]
    [Authorize(Roles = "Customer")] // Only allow customers to leave reviews
    public IActionResult LeaveReview(int id, [FromBody] Review review)
    {
        var book = _context.Books.Find(id);
        if (book == null)
            return NotFound();

        // Add the review to the book
        review.BookId = id; // Assuming you have a BookId property in the Review model
        _context.Reviews.Add(review);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetBookDetails), new { id }, review);
    }
}
