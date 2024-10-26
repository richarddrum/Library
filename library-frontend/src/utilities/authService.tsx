import { jwtDecode } from 'jwt-decode';
import axiosConfig from './axiosConfig';

export const login = async (username: string, password: string, navigate: any, setUserType: any, setTokenIsValid: any) => {
    try {
        const response = await axiosConfig.post('/api/users/login', { username, password });
        // Store the token 
        const decoded: any = jwtDecode(response.data.token);
        const userType = decoded.userType; // Get userType from decoded token
        localStorage.setItem('token', response.data.token);
        // Decode the JWT to get user type
        setTokenIsValid(true); // Set token validity to true
        setUserType(userType); // Update user type in context
        // Redirect to the home page
        navigate('/');
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please try again.');
    }
};
