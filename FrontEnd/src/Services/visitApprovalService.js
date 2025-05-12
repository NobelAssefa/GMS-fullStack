import axios from 'axios';
const API_URL = '/api/visit';

const visitApprovalService = {
    approveVisit: async (visitId) => {
        try {
            const response = await axios.put(`${API_URL}/approvevisit/${visitId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    rejectVisit: async (visitId, reason) => {
        try {
            const response = await axios.put(`${API_URL}/rejectvisit/${visitId}`, { reason });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getVisitDetails: async (visitId) => {
        try {
            const response = await axios.get(`${API_URL}/visit-requests/${visitId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default visitApprovalService; 