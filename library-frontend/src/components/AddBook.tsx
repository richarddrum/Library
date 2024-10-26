import React, { useState } from 'react';
import axiosConfig from '../utilities/axiosConfig'; // Adjust the import based on your axios setup
import { Book } from '../types/Book'; // Import your Book interface
import { getAuthHeader } from '../utilities/ApiUtils';
import { useNavigate } from 'react-router-dom';

const AddBook: React.FC = () => {
    const [book, setBook] = useState<Book>({
        id: 0, // Set this to 0 since it's not needed for a new book
        title: '',
        author: '',
        coverImage: '',
        description: '',
        publisher: '',
        publicationDate: new Date(),
        category: '',
        isbn: '',
        pageCount: 0,
        isAvailable: true,
        checkedOutDate: undefined,
        returnDate: undefined,
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { //TODO fix
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    
        // Handle the date input separately
        if (name === 'publicationDate') {
            setBook({ ...book, publicationDate: new Date(value) });
        } else if (name === 'isAvailable') {
            // If isAvailable is being changed
            const checked = (e.target as HTMLInputElement).checked;
            if (checked) {
                // If set to true, set both dates to null
                setBook({ 
                    ...book, 
                    isAvailable: checked, 
                    checkedOutDate: undefined, 
                    returnDate: undefined 
                });
            } else {
                // If set to false, set checkedOutDate to today and returnDate to 5 days from now
                const today = new Date();
                const returnDate = new Date();
                returnDate.setDate(today.getDate() + 5); // Set return date to 5 days from today
    
                setBook({ 
                    ...book, 
                    isAvailable: checked, 
                    checkedOutDate: today, 
                    returnDate: returnDate 
                });
            }
        } else {
            // For all other fields
            setBook({ ...book, [name]: value });
        }
    };
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const config = getAuthHeader();

            const bookToSend = {
                ...book,
                publicationDate: book.publicationDate.toISOString(),
                checkedOutDate: book.checkedOutDate?.toISOString(), //TODO: these are not being set?
                returnDate: book.returnDate?.toISOString() 
            };

            console.log(bookToSend);

            // Sending POST request to the API
            await axiosConfig.post('/api/books', bookToSend, config);
            navigate('/manage-books'); // Navigate back to the book list after editing
            setBook({
                id: 0,
                title: '',
                author: '',
                coverImage: '',
                description: '',
                publisher: '',
                publicationDate: new Date(),
                category: '',
                isbn: '',
                pageCount: 0,
                isAvailable: true,
                checkedOutDate: undefined,
                returnDate: undefined,
            });
        } catch (error) {
            setError('Failed to add book. Please try again.');
            console.error('Error adding book:', error);
        }
    };

    return (
        <div>
            <h2>Add Book</h2>
            <form onSubmit={handleSubmit}>
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
                    <label>Image URL:</label>
                    <input type="text" name="coverImage" value={book.coverImage} onChange={handleChange} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={book.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Publisher:</label>
                    <input type="text" name="publisher" value={book.publisher} onChange={handleChange} required />
                </div>
                <div>
                    <label>Publication Date:</label>
                    <input type="date" name="publicationDate" value={book.publicationDate.toISOString().split('T')[0]} onChange={handleChange} required />
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
                    <label>Is Available:</label>
                    <input type="checkbox" name="isAvailable" checked={book.isAvailable} onChange={(e) => setBook({ ...book, isAvailable: e.target.checked })} />
                </div>
                <button type="submit">Add Book</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddBook;
