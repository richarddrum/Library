import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const { userType, tokenIsValid, setUserType, setTokenIsValid } = useUserContext();

    const handleHome = () => {
        navigate('/'); 
    };
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setUserType(null); // Clear user type
        setTokenIsValid(false); // Set token validity to false
        navigate('/login');
    };
    const handleManageBooks = () => {
        navigate('/manage-books'); 
    };
    const handleBrowseBooks = () => {
        navigate('/browse-books'); 
    };
    const handleCheckedOutBooks = () => {
        navigate('/checked-out'); 
    };
    const handleLogin = () => {
        navigate('/login');
    };
    const handleRegister = () => {
        navigate('/signup'); 
    };
    const handleFeatured = () => {
        navigate('/featured-books'); 
    };
    const handleSearch = () => {
        navigate('/book-search'); 
    };
    
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <button onClick={handleHome}>Home</button>
                    </li>
                    <li>
                        {!tokenIsValid && (<button onClick={handleRegister}>Register</button>)}
                    </li>
                    <li>
                        {!tokenIsValid && (<button onClick={handleLogin}>Login</button>)}
                    </li>
                    <li>
                        {tokenIsValid && (<button onClick={handleFeatured}>Featured Books</button>)}
                    </li>
                    <li>
                        {tokenIsValid && userType === 'Librarian' && (<button onClick={handleManageBooks}> Manage Books</button>)}
                    </li>
                    <li>
                        {tokenIsValid && userType === 'Librarian' && (<button onClick={handleCheckedOutBooks}> Checked Out Books</button>)}
                    </li>
                    <li>
                        {tokenIsValid && userType === 'Customer' && (<button onClick={handleBrowseBooks}> Browse Books</button>)}
                    </li>
                    <li>
                        {tokenIsValid && (<button onClick={handleSearch}>Book Search</button>)}
                    </li>
                    <li>
                        {tokenIsValid && (<button onClick={handleLogout}>Logout</button>)}
                    </li>
                </ul>
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
