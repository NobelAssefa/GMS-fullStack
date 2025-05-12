import axios from 'axios';
const API_URL = '/api/visit';

const checkInService = {
    searchVisit: async (query) => {
        console.log("query", query);
        
        try {
            console.log("Searching for visit with query:", query);
            const response = await axios.get(`${API_URL}/getApprovedVisits`, { withCredentials: true });
            const visits = response.data;
            console.log("All visits from API:", visits);
            
            if (!visits || visits.length === 0) {
                console.log("No visits found in the API response");
                return null;
            }
            
            // Find visit by unique_code or guest name, but only if it's approved
            const foundVisit = visits.find(v => {
                console.log("\nChecking visit:", v);
                console.log("Visit approval status:", v.is_approved);
                console.log("Visit unique code:", v.unique_code);
                console.log("Visit guest name:", v.guest_id?.fullName);
                
                const uniqueCode = v.unique_code?.toLowerCase() || '';
                const guestName = v.guest_id?.fullName?.toLowerCase() || '';
                const searchQuery = query.toLowerCase();
                
                console.log("Comparing:", {
                    uniqueCode,
                    guestName,
                    searchQuery,
                    isApproved: v.is_approved,
                    uniqueCodeMatch: uniqueCode === searchQuery,
                    guestNameMatch: guestName.includes(searchQuery)
                });
                
                const isMatch = v.is_approved && (
                    uniqueCode === searchQuery 
                );
                
                console.log("Is this visit a match?", isMatch);
                return isMatch;
            });
            
            console.log("\nFinal found visit result:", foundVisit);
            if (!foundVisit) {
                console.log("No matching visit found for query:", query);
            }
            
            return foundVisit;
        } catch (error) {
            console.error("Error in searchVisit:", error);
            throw error;
        }
    },

    checkIn: async (uniqueCode) => {
        try {
            const response = await axios.put(`${API_URL}/checkinvisit/${uniqueCode}`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkOut: async (uniqueCode) => {
        try {
            const response = await axios.put(`${API_URL}/checkoutvisit/${uniqueCode}`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default checkInService; 