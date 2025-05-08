import api from './api';

const API_URL = '/user'; // Using relative path since baseURL is set in api.js

const userService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get(`${API_URL}/getusers`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch users';
        }
    },

    // Get single user
    getUser: async (id) => {
        try {
            const response = await api.get(`${API_URL}/getuser/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch user';
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const emailNormalized = userData.email.trim().toLowerCase();
            const userExist = await api.get(`${API_URL}/checkemail/${emailNormalized}`);
            if (userExist.data.exists) {
                throw new Error("email is already registered");
            }
            const response = await api.post(`/auth/register`, {
                ...userData,
                email: emailNormalized
            }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create user';
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/user/update/${id}`, userData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update user';
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/user/delete/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete user';
        }
    },

    // Get all roles
    getRoles: async () => {
        try {
            const response = await api.get(`/role/getroles`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch roles';
        }
    },

    // Get all departments
    getDepartments: async () => {
        try {
            const response = await api.get(`/department/getdepartments`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch departments';
        }
    }
};

export default userService; 