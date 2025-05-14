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
            const errorMessage = error.response.data.message || 'An error occurred';
            return Promise.reject({ 
                message: errorMessage,
                status: error.response.status 
            });
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject({ 
                message: 'No response from server',
                status: 503
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject({ 
                message: error.message,
                status: 500
            });
        }
    }
);

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
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
            throw error;
        }
    },
    checkAuth: async () => {
        try {
            const response = await api.get('/auth/check-auth');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api; 