// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home'; 
import SignUp from './SignUp';
import ManageBooks from './ManageBooks';
import AddBook from './AddBook';
import EditBook from './EditBook';
import Layout from './Layout';
import FeaturedBooks from './FeaturedBooks';
import BookDetails from './BookDetails';
import BrowseBooks from './BrowseBooks';
import BookSearch from './BookSearch';
import { UserProvider } from './UserContext';
import CheckedOutBooks from './CheckedOutBooks';

const App: React.FC = () => {
    return (
        <Router>
            <UserProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/manage-books" element={<ManageBooks />} />
                        <Route path="/browse-books" element={<BrowseBooks />} />
                        <Route path="/add-book" element={<AddBook />} />
                        <Route path="/edit-book/:id" element={<EditBook />} />
                        <Route path="/featured-books" element={<FeaturedBooks />} />
                        <Route path="/book-details/:id" element={<BookDetails />} />
                        <Route path="/book-search" element={<BookSearch />} />
                        <Route path="/checked-out" element={<CheckedOutBooks />} />
                    </Routes>
                </Layout>
            </UserProvider>
        </Router>
    );
};

export default App;
