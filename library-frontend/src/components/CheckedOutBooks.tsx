// src/CheckedOutBooks.tsx
import React, { useEffect, useState } from 'react';
import axiosConfig from '../utilities/axiosConfig';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';

const CheckedOutBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCheckedOutBooks();
    }, []);

    const fetchCheckedOutBooks = async () => {
        try {
            const config = getAuthHeader(); 
            const response = await axiosConfig.get('/api/books/checkedout', config); 
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching checked-out books:', error);
            setError('Failed to fetch checked-out books.');
        }
    };

    return (
        <div>
            <h2>Checked Out Books</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {books.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Checked Out Date</th>
                            <th>Return Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.description}</td>
                                <td>{book.checkedOutDate ? new Date(book.checkedOutDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No checked-out books found.</p>
            )}
        </div>
    );
};

export default CheckedOutBooks;
