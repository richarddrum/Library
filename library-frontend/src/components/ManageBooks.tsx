import React, { useEffect, useState } from 'react';
import axiosConfig from '../utilities/axiosConfig';
import BookList from './BookList';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';
import { useNavigate } from 'react-router-dom';

const ManageBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const config = getAuthHeader(); 
            const response = await axiosConfig.get('/api/books', config);
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            // set an error state here if needed?
        }
    };

    const handleDelete = async (id: number) => {
        console.log('Delete book with ID:', id);
        try {
            const config = getAuthHeader(); 
            await axiosConfig.delete(`/api/books/${id}`, config); // Delete book by ID
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEdit = (book: Book) => {
        // Navigate to the edit page with the book ID
        navigate(`/edit-book/${book.id}`); 
    };
    
    const handleAddBook = () => {
        navigate('/add-book'); // Navigate to the add book page
    };

    return (
        <div>
            <button className="add-book-button" onClick={handleAddBook}>Add Book</button>
            <BookList books={books} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
    );
};

export default ManageBooks;
