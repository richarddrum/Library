using Bogus;
using BookStoreAPI.Data;
using BookStoreAPI.Models;

public static class DatabaseSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (!context.Books.Any())
        {
            var booksFaker = new Faker<Book>()
                .RuleFor(b => b.Title, f => f.Lorem.Sentence(3))
                .RuleFor(b => b.Author, f => f.Person.FullName)
                .RuleFor(b => b.Description, f => f.Lorem.Paragraph(2)) // Random description
                .RuleFor(b => b.CoverImage, f => f.Image.PicsumUrl()) // Random image URL
                .RuleFor(b => b.Publisher, f => f.Company.CompanyName()) // Random publisher name
                .RuleFor(b => b.PublicationDate, f => f.Date.Past(10)) // Random past date within the last 10 years
                .RuleFor(b => b.Category, f => f.PickRandom(new[] { "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Biography", "Romance" })) // Random category
                .RuleFor(b => b.ISBN, f => f.Random.AlphaNumeric(13)) // Random 13-character ISBN
                .RuleFor(b => b.PageCount, f => f.Random.Number(100, 1000)) // Random page count between 100 and 1000
                .RuleFor(b => b.IsAvailable, f => f.Random.Bool()) // Random bool
                .RuleFor(b => b.CheckedOutDate, (f, b) => 
                    b.IsAvailable 
                        ? (DateTime?)null 
                        : f.Date.Between(DateTime.Now.AddDays(-5), DateTime.Now.AddDays(-1))) // Checkout date within the last 5 days
                .RuleFor(b => b.ReturnDate, (f, b) => 
                    b.CheckedOutDate.HasValue 
                        ? b.CheckedOutDate.Value.AddDays(5) // Always 5 days after checkout date
                        : (DateTime?)null); // Return date is null if available.

            var books = booksFaker.Generate(100);
            context.Books.AddRange(books);
            context.SaveChanges();
        }
    }
}