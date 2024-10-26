// src/ManageBooks.tsx
import React, { useEffect, useState } from 'react';
import axiosConfig from '../utilities/axiosConfig';
import BookList from './BookList';
import { Book } from '../types/Book';
import { getAuthHeader } from '../utilities/ApiUtils';

const BrowseBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBrowseBooks();
    }, []);

    const fetchBrowseBooks = async () => {
        try {
            const config = getAuthHeader(); 
            const response = await axiosConfig.get('/api/books', config); 
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    return (
        <div>
            <BookList books={books} handleEdit={undefined} handleDelete={undefined} />
        </div>
    );
};

export default BrowseBooks;
