import axios from 'axios';

const API_URL = 'http://localhost:5001/api/stats';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const statsService = {
    getSummary: async () => {
        try {
            const response = await axios.get(`${API_URL}/summary`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch analytics'
            };
        }
    },
    
    getAgentPerformance: async () => {
        try {
            const response = await axios.get(`${API_URL}/agent-performance`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch agent performance'
            };
        }
    },
    
    getAuditLogs: async (limit = 50) => {
        try {
            const response = await axios.get(`${API_URL}/audit-logs?limit=${limit}`, getAuthHeaders());
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch audit logs'
            };
        }
    },
    
    downloadCsv: async () => {
        try {
            const response = await axios.get(`${API_URL}/export/csv`, {
                ...getAuthHeaders(),
                responseType: 'blob' // Important for downloading files
            });
            
            // Create a temporary link to download the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tickets_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to download CSV'
            };
        }
    }
};
