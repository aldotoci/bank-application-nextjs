import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    withCredentials: true,  // Important for sending cookies
});

class ClientService {
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
            'X-CSRFToken': ClientService.getCsrfToken()
        };
    }

    static async getApplicationStatuses(id = null) {
        try {
            const endpoint = id ? `/application-statuses/${id}/` : '/application-statuses/';
            const response = await api.get(endpoint, {
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const response = await api.get(`/users/${id}/`, {
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Bank account management methods
    static async listBankAccounts({filter = {}}) {
        console.log(filter);
        const params = new URLSearchParams(filter).toString();
        console.log(params);
        const url = params ? `/bank-accounts/?${params}` : '/bank-accounts/';
        try {
            const response = await api.get(url, {
                headers: ClientService.getHeaders(),
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getBankAccount(id) {
        try {
            const response = await api.get(`/bank-accounts/${id}/`, {
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCard(id) {
        try {
            const response = await api.get(`/cards/${id}/`, {
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getTransaction(id) {
        try {
            const response = await api.get(`/transactions/${id}/`, {
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getBankAccountApplication(id) {
        try {
            const response = await api.get(`/bank-account-applications/${id}/`, {
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createBankAccountApplication(applicationData) {
        try {
            const response = await api.post('/bank-account-applications/', applicationData, {
                headers: ClientService.getHeaders()
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
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCardApplication(id) {
        try {
            const response = await api.get(`/card-applications/${id}/`, {
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createCardApplication(applicationData) {
        try {
            const response = await api.post('/card-applications/', applicationData, {
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async transferMoney(transferData) {
        try {
            const response = await api.post('/transfer-money/', transferData, {
                headers: ClientService.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ClientService;