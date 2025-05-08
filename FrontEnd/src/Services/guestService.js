import axios from 'axios';

const API_URL = '/api/guest';

// Register a new guest
const registerGuest = async (guestData) => {
    try {
        const response = await axios.post(`${API_URL}/createguest`, guestData);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Failed to register guest');
    }
};

// Get all guests with their cars and items
const getAllGuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/getguests`,{
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Failed to fetch guests');
    }
};

// Get a single guest by ID with their car and items
const getGuestById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/getguest/${id}`,{
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Failed to fetch guest');
    }
};

// Update a guest
const updateGuest = async (id, guestData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, guestData);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Failed to update guest');
    }
};

// Delete a guest
const deleteGuest = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Failed to delete guest');
    }
};

const guestService = {
    registerGuest,
    getAllGuests,
    getGuestById,
    updateGuest,
    deleteGuest
};

export default guestService; 