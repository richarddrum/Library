// src/Layout.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/AuthenticationUtils';
import { jwtDecode } from 'jwt-decode';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/'); 
    };
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };
    const handleManageBooks = () => {
        navigate('/manage-books'); 
    };
    const handleBrowseBooks = () => {
        navigate('/browse-books'); 
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
    const token = localStorage.getItem('token');
    const [userType, setUserType] = useState<string | null>(null);
    const tokenIsValid = isTokenValid(token);
    // If token is not valid, redirect to login
    useEffect(() => {
        if (tokenIsValid && token)
        {
            const decoded: any = jwtDecode(token);
            setUserType(decoded.userType); 
        }
    }, [token, navigate, tokenIsValid]);
    
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
                        {tokenIsValid && userType === 'Customer' && (<button onClick={handleBrowseBooks}> Browse Books</button>)}
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
