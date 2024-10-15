import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    withCredentials: true,  // Important for sending cookies
});

class BankerService {
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

    // Bank account management methods
    static async listBankAccounts() {
        try {
            const response = await api.get('/bank-accounts/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getBankAccount(id) {
        try {
            const response = await api.get(`/bank-accounts/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createBankAccount(bankAccountData) {
        try {
            const response = await api.post('/bank-accounts/', bankAccountData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateBankAccount(id, bankAccountData) {
        try {
            const response = await api.put(`/bank-accounts/${id}/`, bankAccountData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteBankAccount(id) {
        try {
            const response = await api.delete(`/bank-accounts/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Card management methods
    static async listCards() {
        try {
            const response = await api.get('/cards/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCard(id) {
        try {
            const response = await api.get(`/cards/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createCard(cardData) {
        try {
            const response = await api.post('/cards/', cardData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateCard(id, cardData) {
        try {
            const response = await api.put(`/cards/${id}/`, cardData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteCard(id) {
        try {
            const response = await api.delete(`/cards/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Transaction management methods
    static async listTransactions() {
        try {
            const response = await api.get('/transactions/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getTransaction(id) {
        try {
            const response = await api.get(`/transactions/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Bank account application management methods
    static async listBankAccountApplications() {
        try {
            const response = await api.get('/bank-account-applications/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getBankAccountApplication(id) {
        try {
            const response = await api.get(`/bank-account-applications/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async bankApplicationBankerAction(id, actionData) {
        try {
            const response = await api.post(`/bank-account-applications/${id}/banker-action/`, actionData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Card application management methods
    static async listCardApplications() {
        try {
            const response = await api.get('/card-applications/', {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCardApplication(id) {
        try {
            const response = await api.get(`/card-applications/${id}/`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async cardApplicationBankerAction(id, actionData) {
        try {
            const response = await api.post(`/card-applications/${id}/banker-action/`, actionData, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default BankerService;