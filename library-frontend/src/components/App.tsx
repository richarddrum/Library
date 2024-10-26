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

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/manage-books" element={<ManageBooks />} />
                    <Route path="/add-book" element={<AddBook />} />
                    <Route path="/edit-book/:id" element={<EditBook />} />
                    <Route path="/featured-books" element={<FeaturedBooks />} />
                    <Route path="/book-details/:id" element={<BookDetails />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
