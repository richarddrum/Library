import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../utilities/axiosConfig';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';
import { useUserContext } from './UserContext';

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviewText, setReviewText] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const { userType } = useUserContext();
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

    // use callback to avoid rerenders (?)
    const fetchBook = useCallback(async () => {
        try {
            const config = getAuthHeader();
            const response = await axiosConfig.get(`/api/books/${id}`, config);
            const fetchedBook = response.data;

            // Convert publicationDate to Date if it's a string
            if (typeof fetchedBook.publicationDate === 'string') {
                fetchedBook.publicationDate = new Date(fetchedBook.publicationDate);
            }

            // Map reviews to correct structure if needed
            fetchedBook.reviews = fetchedBook.reviews?.map((review: any) => ({
                message: review.message, // Ensure the casing matches the API response
                rating: review.rating,
            })) || [];

            setBook(fetchedBook);
        } catch (error) {
            console.error('Error fetching book:', error);
            setError('Failed to fetch book details.');
        }
    }, [id]); // Add 'id' as dependency

    useEffect(() => {
        fetchBook(); // Call fetchBook on component mount
    }, [fetchBook]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Check if the rating is selected
        if (rating === null) {
            setValidationMessage('Please select a rating before submitting your review.'); // Set validation message
            return; // Exit the function if no rating is selected
        }
        if (book) {
            try {
                const config = getAuthHeader();
                await axiosConfig.post(`/api/books/${id}/reviews`, { review: reviewText, rating }, config);

                // After submitting the review, refetch the book
                await fetchBook(); // Refetch the book to include the new review

                setReviewText(''); // Clear the input field
                setRating(null); // Reset the rating
                setValidationMessage(null); // Clear validation message after successful submission
            } catch (error) {
                console.error('Error submitting review:', error);
                setError('Failed to submit your review.'); // Generic error message for other issues
            }
        }
    };

    const handleCheckout = async () => {
        if (book && book.isAvailable) {
            try {
                const config = getAuthHeader();
                await axiosConfig.post(`/api/books/${id}/checkout`, {}, config); 

                // Optionally refetch the book to update its status
                await fetchBook();
                alert('Book checked out successfully!');
            } catch (error) {
                console.error('Error attempting checkout: ', error);
                setError('Failed to checkout book.'); // Generic error message for other issues
            }
        }
    };

    const handleReturn = async () => {
        if (book && !book.isAvailable) {
            try {
                const config = getAuthHeader();
                await axiosConfig.post(`/api/books/${id}/return`, {}, config);
                // Optionally refetch the book to update its status
                await fetchBook();
                alert('Book returned successfully!');
            } catch (error) {
                console.error('Error attempting return: ', error);
                setError('Failed to return book.'); // Generic error message for other issues
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
                {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((review, index) => (
                        <li key={index}>
                            <strong>{`Rating: ${review.rating}`} </strong>
                            {review.message}
                        </li>
                    ))
                ) : (
                    <li>No customer reviews available.</li> 
                )}
            </ul>

            {userType === 'Customer' && <form onSubmit={handleReviewSubmit}>
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
                {validationMessage && <div style={{ color: 'red' }}>{validationMessage}</div>}
                <button type="submit">Submit Review</button>
            </form>}
            
            {book.isAvailable && userType === 'Customer' && (
                <button onClick={handleCheckout} style={{ marginTop: '20px' }}>
                    Checkout Book
                </button>
            )}
            
            {!book.isAvailable && userType === 'Librarian' && (
                <button onClick={handleReturn} style={{ marginTop: '20px' }}>
                    Return Book
                </button>
            )}

            <button onClick={() => navigate(-1)}>Back to Book List</button>
        </div>
    );
};

export default BookDetails;
