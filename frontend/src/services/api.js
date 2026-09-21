/**
 * api.js — Axios instance for K2 Fast Foods.
 *
 * HOW THE PROXY WORKS:
 * - In development (npm start), React dev server proxies all requests
 *   from localhost:3000 → localhost:8080, so CORS never happens.
 * - BASE_URL uses a relative path — no host means no cross-origin request.
 * - In production (npm run build), set REACT_APP_API_URL in .env to full URL.
 */
import axios from 'axios';

// Development: use relative path (proxied by React dev server)
// Production:  set REACT_APP_API_URL=https://yourdomain.com/api/v1 in .env
const BASE_URL = process.env.REACT_APP_API_URL
  || '/k2fastfoods/backend/public/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('k2_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('k2_token');
      localStorage.removeItem('k2_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
