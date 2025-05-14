import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for handling cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject({ message: 'No response from server' });
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject({ message: error.message });
        }
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData, {
                headers: {
                    ...(userData instanceof FormData ? 
                        { 'Content-Type': 'multipart/form-data' } : 
                        { 'Content-Type': 'application/json' })
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    },
    checkAuth: async () => {
        const response = await api.get('/auth/check-auth');
        return response.data;
    }
};

export default api; 