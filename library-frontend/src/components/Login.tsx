import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utilities/authService';
import { useUserContext } from './UserContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUserType, setTokenIsValid } = useUserContext();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password, navigate, setUserType, setTokenIsValid); // Use the imported login function
        } catch (error) {
            setError('Invalid username or password'); // Set the error message if login fails
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <p className="link">
                <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Don't have an account? Register</span>
            </p>
        </div>
    );
};

export default Login;
