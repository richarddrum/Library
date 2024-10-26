import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../utilities/axiosConfig';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';

const EditBook: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (book) {
            // Handle publicationDate conversion from string to Date
            if (name === 'publicationDate') {
                setBook({ ...book, [name]: new Date(value) }); // Convert value to Date
            } else {
                setBook({ ...book, [name]: value });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (book) {
            try {
                const config = getAuthHeader();
                await axiosConfig.put(`/api/books/${id}`, book, config);
                console.log(`book id ${id} edited successfully`);
                navigate('/manage-books'); // Navigate back to the book list after editing
            } catch (error) {
                console.error('Error updating book:', error);
                setError('Failed to update book.');
            }
        }
    };
    
    // Conditional rendering
    if (book === null) {
        return <div>Loading...</div>; // Show a loading message while fetching
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Book</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={book.title} onChange={handleChange} required />
            </div>
            <div>
                <label>Author:</label>
                <input type="text" name="author" value={book.author} onChange={handleChange} required />
            </div>
            <div>
                <label>Category:</label>
                <select name="category" value={book.category} onChange={handleChange} required>
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                    <option value="Romance">Romance</option>
                </select>
            </div>
            <div>
                <label>Cover Image:</label>
                <input type="text" name="coverImage" value={book.coverImage} onChange={handleChange} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={book.description} onChange={handleChange} required />
            </div>
            <div>
                <label>ISBN:</label>
                <input type="text" name="isbn" value={book.isbn} onChange={handleChange} required />
            </div>
            <div>
                <label>Page Count:</label>
                <input type="number" name="pageCount" value={book.pageCount} onChange={handleChange} required />
            </div>
            <div>
                <label>Publisher:</label>
                <input type="text" name="publisher" value={book.publisher} onChange={handleChange} required />
            </div>
            <div>
                <label>Publication Date:</label>
                <input
                    type="date"
                    name="publicationDate"
                    value={book?.publicationDate.toISOString().split('T')[0] || ''} // Convert Date to string
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Update Book</button>
        </form>
    );
};

export default EditBook;
