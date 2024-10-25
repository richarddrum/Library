import axiosConfig from '../utilities/axiosConfig';

export const login = async (username: string, password: string, navigate: any) => {
    try {
        const response = await axiosConfig.post('/api/users/login', { username, password });
        // Store the token 
        localStorage.setItem('token', response.data.token);
        // Redirect to the home page
        navigate('/');
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please try again.');
    }
};