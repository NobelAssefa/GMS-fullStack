import api from './api';

const API_URL = '/user'; // Using relative path since baseURL is set in api.js

const userService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get(`${API_URL}/getusers`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const response = await api.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`${API_URL}/update/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await api.put(`${API_URL}/delete/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default userService; 