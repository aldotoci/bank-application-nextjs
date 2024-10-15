"use client";
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  withCredentials: true,  // Important for sending cookies
});

class AuthService {
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

  static deleteSessionId() {
    document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
      'X-CSRFToken': AuthService.getCsrfToken()
    };
  }

  static deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }

  static async login(username, password) {
    AuthService.deleteSessionId();
    
    try {
      const response = await api.post('/login/', {
        username: username,
        password: password
      },
       {
        headers: AuthService.getHeaders()
      }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      const response = await api.post('/logout/', {}, {
        headers: AuthService.getHeaders()
      });
      AuthService.deleteAllCookies();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await api.get('/get-current-user/', {
        headers: AuthService.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;