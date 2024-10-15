import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    withCredentials: true,  // Important for sending cookies
});

class AdminService {
    // Get sessionId from cookies
    static getSessionId() {
        const name = 'sessionid=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return null;
    }

    // Get csrfToken from cookies
    static getCsrfToken() {
        const name = 'csrftoken=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return null;
    }

    static getHeaders() {
        return {
            'X-CSRFToken': this.getCsrfToken()
        };
    }

    static async getApplicationStatuses(id = null) {
        try {
            const endpoint = id ? `/application-statuses/${id}/` : '/application-statuses/';
            const response = await api.get(endpoint, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getRoles(id = null) {
        try {
            const endpoint = id ? `/roles/${id}/` : '/roles/';
            const response = await api.get(endpoint, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCurrencies(id = null) {
        try {
            const endpoint = id ? `/currencies/${id}/` : '/currencies/';
            const response = await api.get(endpoint, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCardTypes(id = null) {
        try {
            const endpoint = id ? `/card-types/${id}/` : '/card-types/';
            const response = await api.get(endpoint, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getTransactionTypes(id = null) {
        try {
            const endpoint = id ? `/transaction-types/${id}/` : '/transaction-types/';
            const response = await api.get(endpoint, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // User management methods
    static async listUsers() {
        try {
            const response = await api.get('/users/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const response = await api.get(`/users/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const response = await api.post('/users/', userData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, userData) {
        try {
            const response = await api.put(`/users/${id}/`, userData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const response = await api.delete(`/users/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default AdminService;