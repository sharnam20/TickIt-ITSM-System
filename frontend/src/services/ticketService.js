import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tickets';

// Set up axios interceptor to include JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const ticketService = {
    createTicket: async (ticketData) => {
        try {
            const response = await axios.post(API_URL, ticketData, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create ticket'
            };
        }
    },

    getTickets: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const url = params ? `${API_URL}?${params}` : API_URL;
            const response = await axios.get(url, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch tickets'
            };
        }
    },

    // Alias for customers — backend filters by role automatically
    getMyTickets: async () => {
        try {
            const response = await axios.get(`${API_URL}?limit=200`, getAuthHeaders());
            return { success: true, data: response.data.tickets || [] };
        } catch (error) {
            return {
                success: false,
                data: [],
                error: error.response?.data?.error || 'Failed to fetch tickets'
            };
        }
    },

    getTicketById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch ticket details'
            };
        }
    },

    updateTicket: async (id, updateData) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}`, updateData, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update ticket'
            };
        }
    },

    deleteTicket: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete ticket'
            };
        }
    },

    getComments: async (ticketId) => {
        try {
            const response = await axios.get(`${API_URL}/${ticketId}/comments`, getAuthHeaders());
            return { success: true, data: response.data.comments };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch comments'
            };
        }
    },

    addComment: async (ticketId, content, isInternal = false) => {
        try {
            const response = await axios.post(`${API_URL}/${ticketId}/comments`, {
                content,
                is_internal: isInternal
            }, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add comment'
            };
        }
    },

    escalateTicket: async (ticketId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/customer/tickets/${ticketId}/escalate`, {}, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to escalate ticket'
            };
        }
    }
};
