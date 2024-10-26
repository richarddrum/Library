import React, { useEffect, useState } from 'react';
import axiosConfig from '../utilities/axiosConfig';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';
import BookList from './BookList';

const BookSearch: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true); 
            try {
                const config = getAuthHeader();
                const response = await axiosConfig.get('/api/books', config);
                setBooks(response.data);
                setFilteredBooks(response.data); // Initially display all books
            } catch (error) {
                console.error('Error fetching books:', error);
                setError('Failed to fetch books.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        // Filter books based on the search query
        const results = books.filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBooks(results);
    }, [searchQuery, books]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return <div>Loading books...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Search for Books</h1>
            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            />
            <h2>Results:</h2>
            <ul>
                {filteredBooks.length > 0 ? (
                    <BookList books={filteredBooks} />
                ) : (
                    <li>No books found.</li>
                )}
            </ul>
        </div>
    );
};

export default BookSearch;
