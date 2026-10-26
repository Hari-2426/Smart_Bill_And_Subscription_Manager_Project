import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
});

// Request Interceptor: Attach JWT Token automatically
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('smartbill_admin_token');
    const userToken = localStorage.getItem('smartbill_token');
    
    // Use admin token if calling an /admins endpoint or if userToken is not present
    const token = config.url && config.url.includes('/admins') && adminToken ? adminToken : (userToken || adminToken);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors & handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized (Expired or Invalid token)
      if (status === 401) {
        if (error.config?.url?.includes('/admins')) {
          localStorage.removeItem('smartbill_admin_token');
          localStorage.removeItem('smartbill_admin');
        } else {
          localStorage.removeItem('smartbill_token');
          localStorage.removeItem('smartbill_user');
        }
      }

      // If login failed with 403 / 401, provide a clean friendly message
      if ((status === 403 || status === 401) && error.config?.url?.includes('/login')) {
        return Promise.reject(new Error('Invalid email or password. Please verify your credentials or create an account.'));
      }

      // Extract user-friendly error message
      const serverMessage =
        error.response.data?.message ||
        (typeof error.response.data === 'string' ? error.response.data : null) ||
        `Request failed with status ${status}`;

      return Promise.reject(new Error(serverMessage));
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error('The cloud server is taking longer than usual to wake up. It is now active—please try again now!'));
    } else if (error.request) {
      return Promise.reject(new Error('Unable to reach the SmartBill server. If the server was sleeping, it is waking up now—please click again!'));
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected error occurred.'));
    }
  }
);

export default apiClient;
