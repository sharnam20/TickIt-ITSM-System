import axios from 'axios';
import { getCurrentToken } from '../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = getCurrentToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
    getStaff: async () => {
        try {
            const response = await axios.get(`${API_URL}/users/staff`, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data.staff };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch staff members'
            };
        }
    },

    createStaff: async (staffData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/create-staff`, staffData, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create staff account'
            };
        }
    },

    getMe: async () => {
        try {
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data.user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch user profile'
            };
        }
    },

    updateStatus: async (status) => {
        try {
            const response = await axios.patch(`${API_URL}/users/me/status`, { status }, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update status'
            };
        }
    },

    updateSkills: async (skills) => {
        try {
            const response = await axios.patch(`${API_URL}/users/me/skills`, { skills }, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update skills'
            };
        }
    }
};
