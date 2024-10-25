// src/SignUp.tsx
import React, { useState } from 'react';
import axiosConfig from '../utilities/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // Import your centralized CSS
import { login } from './authService';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Customer'); // Default to Customer
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessages([]); // Reset error messages before making the request
        setSuccess('');

        try {
            await axiosConfig.post('/api/users/register', { 
                username, 
                email, 
                password,
                userType  // Include userType in the registration request
            });
            setSuccess('User registered successfully!');
            // Automatically log in the user after registration
            await login(username, password, navigate);
        } catch (error: any) {
            // Check if the response contains error messages
            if (error.response && error.response.data.errors) {
                setErrorMessages(error.response.data.errors); // Set specific error messages
            } else {
                setErrorMessages(['Registration failed. Please try again.']);
            }
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
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
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div>
                    <label>User Type:</label>
                    <div>
                        <input
                            type="radio"
                            id="customer"
                            name="userType"
                            value="Customer"
                            checked={userType === 'Customer'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        <label htmlFor="customer">Customer</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="librarian"
                            name="userType"
                            value="Librarian"
                            checked={userType === 'Librarian'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        <label htmlFor="librarian">Librarian</label>
                    </div>
                </div>
                <button type="submit">Sign Up</button>
                {errorMessages.length > 0 && (
                    <div style={{ color: 'red' }}>
                        {errorMessages.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    </div>
                )}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
            <p className="link">
                <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Already have an account? Login</span>
            </p>
        </div>
    );
};

export default SignUp;
