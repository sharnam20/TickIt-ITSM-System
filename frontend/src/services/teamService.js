import axios from 'axios';
import { getCurrentToken } from '../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = getCurrentToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const teamService = {
    getTeams: async () => {
        try {
            const response = await axios.get(`${API_URL}/teams/`, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data.teams };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch teams'
            };
        }
    },

    createTeam: async (teamData) => {
        try {
            const response = await axios.post(`${API_URL}/teams/`, teamData, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create team'
            };
        }
    },

    updateTeam: async (teamId, teamData) => {
        try {
            const response = await axios.put(`${API_URL}/teams/${teamId}`, teamData, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update team'
            };
        }
    },

    deleteTeam: async (teamId) => {
        try {
            const response = await axios.delete(`${API_URL}/teams/${teamId}`, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete team'
            };
        }
    },

    addMember: async (teamId, userId) => {
        try {
            const response = await axios.post(`${API_URL}/teams/${teamId}/add-member`, { user_id: userId }, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add member'
            };
        }
    },

    removeMember: async (teamId, userId) => {
        try {
            const response = await axios.post(`${API_URL}/teams/${teamId}/remove-member`, { user_id: userId }, {
                headers: getAuthHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to remove member'
            };
        }
    }
};
