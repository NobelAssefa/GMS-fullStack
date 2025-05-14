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
            const response = await api.get(`${API_URL}/getuserbyid/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch user';
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const formData = new FormData();
            
            // Append all user data except avatar
            Object.keys(userData).forEach(key => {
                if (key !== 'avatar') {
                    formData.append(key, userData[key]);
                }
            });

            // Append avatar if it exists
            if (userData.avatar) {
                formData.append('avatar', userData.avatar);
            }

            const response = await api.post(`/auth/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create user';
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const formData = new FormData();
            
            // Append all user data except avatar
            Object.keys(userData).forEach(key => {
                if (key !== 'avatar') {
                    formData.append(key, userData[key]);
                }
            });

            // Append avatar if it exists
            if (userData.avatar) {
                formData.append('avatar', userData.avatar);
            }

            const response = await api.put(`${API_URL}/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update user';
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete user';
        }
    },

    // Get all roles
    getRoles: async () => {
        try {
            const response = await api.get(`/role/getroles`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch roles';
        }
    },

    // Get all departments
    getDepartments: async () => {
        try {
            const response = await api.get(`/department/getdepartments`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch departments';
        }
    }
};

export default userService; 