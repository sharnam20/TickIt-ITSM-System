import axios from 'axios';

const API_URL = 'http://localhost:5001/api/solutions';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const solutionService = {
    getSuggestions: async (query) => {
        try {
            const response = await axios.post(`${API_URL}/suggest`, { query }, getAuthHeaders());
            return { success: true, suggestions: response.data.suggestions };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch suggestions'
            };
        }
    }
};
