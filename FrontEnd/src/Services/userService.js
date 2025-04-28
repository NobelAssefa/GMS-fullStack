import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Update with your backend URL

const userService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/getusers`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            const response = await axios.put(`${API_URL}/update/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await axios.put(`${API_URL}/delete/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default userService; 