import axios from 'axios';
const API_URL = '/api/visit';

export const createVisitRequest = async (visitData) => {
  const response = await axios.post(`${API_URL}/createvisit`, visitData, { withCredentials: true });
  return response.data;
}; 