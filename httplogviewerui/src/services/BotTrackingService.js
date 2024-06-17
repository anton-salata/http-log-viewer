import axios from 'axios';

const API_BASE_URL = 'https://localhost:7161/api/';

class BotTrackingService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
        });
    }

    async getAllLogs() {
        try {
            const response = await this.api.get('/httplog');
            return response.data;
        } catch (error) {
            console.error('Error fetching logs:', error);
            throw error;
        }
    }

    async getLogById(id) {
        try {
            const response = await this.api.get(`/httplog/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching log with ID ${id}:`, error);
            throw error;
        }
    }

    async getFilteredLogs(uri, method, statusCode, reasonPhrase) {
        try {
            const response = await this.api.get('/httplog/filtered', {
                params: {
                    uri,
                    method,
                    statusCode,
                    reasonPhrase,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered logs:', error);
            throw error;
        }
    }
}

export default new BotTrackingService();