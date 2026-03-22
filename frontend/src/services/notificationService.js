import axios from 'axios';

const API_URL = 'http://localhost:5001/api/notifications';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const notificationService = {
    getNotifications: async () => {
        try {
            const response = await axios.get(`${API_URL}/`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch notifications'
            };
        }
    },
    markAllRead: async () => {
        try {
            const response = await axios.post(`${API_URL}/mark-read`, {}, getAuthHeaders());
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },
    markRead: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/read`, {}, getAuthHeaders());
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }
};
