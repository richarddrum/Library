import React, { useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

// Define the props for the BookList component
interface BookListProps {
    books: Book[];
    handleEdit?: (book: Book) => void; // Made optional
    handleDelete?: (id: number) => void; // Made optional
}

const BookList: React.FC<BookListProps> = ({ books, handleEdit, handleDelete }) => {
    const [sortField, setSortField] = useState<keyof Book>('title'); // Default sort field
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sort order
    const navigate = useNavigate();

     // Function to handle sorting
    const sortedBooks = [...books].sort((a, b) => {
        const aField = a[sortField];
        const bField = b[sortField];
        // Handle sorting for boolean fields
        if (sortField === 'isAvailable') {
            return sortOrder === 'asc' ? (aField === bField ? 0 : aField ? -1 : 1) : (aField === bField ? 0 : aField ? 1 : -1);
        }
        // Use type assertions to tell TypeScript that a[sortField] and b[sortField] will always be strings
        const aFieldStr = (a[sortField] as unknown as string | undefined)?.toLowerCase() || '';
        const bFieldStr = (b[sortField] as unknown as string | undefined)?.toLowerCase() || '';
        

        if (sortOrder === 'asc') {
            return aFieldStr < bFieldStr ? -1 : aFieldStr > bFieldStr ? 1 : 0;
        } else {
            return aFieldStr > bFieldStr ? -1 : aFieldStr < bFieldStr ? 1 : 0;
        }
    });

    // Function to toggle sorting order
    const toggleSort = (field: keyof Book) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <h3>Book List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Cover</th>
                        <th onClick={() => toggleSort('title')} style={{ cursor: 'pointer' }}>
                            Title {sortField === 'title' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
                        </th>
                        <th onClick={() => toggleSort('author')} style={{ cursor: 'pointer' }}>
                            Author {sortField === 'author' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
                        </th>
                        <th onClick={() => toggleSort('category')} style={{ cursor: 'pointer' }}>
                            Category {sortField === 'category' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
                        </th>
                        <th onClick={() => toggleSort('isAvailable')} style={{ cursor: 'pointer' }}>
                            Is Available {sortField === 'isAvailable' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
                        </th>
                        {(!handleEdit && !handleDelete) && <th>Average Rating</th>}{/* TODO: This is a bad way of finding out to display */}
                        {(handleEdit || handleDelete) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedBooks.map((b) => (
                        <tr key={b.id}>
                            <td>
                                <img src={b.coverImage} alt='' style={{ width: '100px' }} /> {/*TODO: FALLBACK IMAGE? img src=b.coverImage || 'fallback-image-url.jpg'*/}
                            </td>
                            <td>
                                <span 
                                    onClick={() => navigate(`/book-details/${b.id}`)} // Navigate on title click
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Styling for a clickable look
                                >
                                    {b.title}
                                </span>
                            </td>
                            <td>{b.author}</td>
                            <td>{b.category}</td>
                            <td>{b.isAvailable ? 'Yes' : 'No'}</td>
                            {(!handleEdit && !handleDelete) && <td>{b.averageRating !== undefined ? b.averageRating.toFixed(1) : 'N/A'}</td>}
                            <td>
                                {handleEdit && <button onClick={() => handleEdit(b)}>Edit</button>}
                                {handleDelete && <button onClick={() => handleDelete(b.id)}>Delete</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;