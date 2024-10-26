import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../utilities/axiosConfig';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviewText, setReviewText] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null); 
    const navigate = useNavigate();

    const StarRating: React.FC<{ rating: number | null; setRating: (rating: number) => void; }> = ({ rating, setRating }) => {
        return (
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        onClick={() => setRating(star)} 
                        style={{ 
                            cursor: 'pointer', 
                            color: star <= (rating || 0) ? 'gold' : 'lightgray', 
                            fontSize: '24px' 
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const config = getAuthHeader();
                const response = await axiosConfig.get(`/api/books/${id}`, config);
                const fetchedBook = response.data;

                // Convert publicationDate to Date if it's a string
                if (typeof fetchedBook.publicationDate === 'string') {
                    fetchedBook.publicationDate = new Date(fetchedBook.publicationDate);
                }
                setBook(fetchedBook);
            } catch (error) {
                console.error('Error fetching book:', error);
                setError('Failed to fetch book details.');
            }
        };

        fetchBook();
    }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (book) {
            try {
                const config = getAuthHeader();
                await axiosConfig.post(`/api/books/${id}/reviews`, { review: reviewText, rating }, config);
                
                // Optionally, update the local state with the new review
                setBook(prevBook => ({
                    ...prevBook!,
                    customerReviews: [...(prevBook?.customerReviews || []), { review: reviewText, rating }] // Add the new review with rating
                }));

                setReviewText(''); // Clear the input field
                setRating(null); // Reset the rating
            } catch (error) {
                console.error('Error submitting review:', error);
                setError('Failed to submit your review.');
            }
        }
    };

    // Conditional rendering for error and loading states
    if (error) {
        return <div>{error}</div>; // Display error message
    }

    if (book === null) {
        return <div>Loading...</div>; // Show a loading message while fetching
    }

    // Render book details
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>{book.title}</h1>
            <img src={book.coverImage} alt={book.title} style={{ width: '150px', borderRadius: '5px' }} />
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
            <p><strong>Publication Date:</strong> {book.publicationDate ? book.publicationDate.toLocaleDateString() : 'N/A'}</p>
            <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
            <p><strong>Page Count:</strong> {book.pageCount || 'N/A'}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Average Rating:</strong> {book.averageRating ? book.averageRating.toFixed(1) : 'N/A'}</p>
            <p><strong>Is Available:</strong> {book.isAvailable ? 'Yes' : 'No'}</p>
            <p><strong>Checked Out Date:</strong> {book.checkedOutDate ? new Date(book.checkedOutDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Return Date:</strong> {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}</p>
            <h3>Customer Reviews</h3>
            <ul>
                {book.customerReviews && book.customerReviews.length > 0 ? (
                    book.customerReviews.map((review, index) => (
                        <li key={index}>
                            <strong>{`Rating: ${review.rating}`} </strong>
                            {review.review}
                        </li>
                    ))
                ) : (
                    <li>No customer reviews available.</li> // Message when there are no reviews
                )}
            </ul>

            <form onSubmit={handleReviewSubmit}>
                <div>
                    <strong>Rate this book:</strong>
                    <StarRating rating={rating} setRating={setRating} /> {/* Render StarRating component */}
                </div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Leave a review"
                    required
                    rows={4}
                    style={{ width: '100%' }}
                />
                <button type="submit">Submit Review</button>
            </form>

            <button onClick={() => navigate(-1)}>Back to Book List</button>
        </div>
    );
};

export default BookDetails;
