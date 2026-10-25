import apiClient from './client';

export const adminsApi = {
  // Admin Authentication
  loginAdmin: async (credentials) => {
    const response = await apiClient.post('/admins/login', credentials);
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await apiClient.get('/admins/users');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/admins/users/${userId}`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await apiClient.patch(`/admins/users/activate/${userId}`);
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await apiClient.patch(`/admins/users/deactivate/${userId}`);
    return response.data;
  },

  // Admin Directory (Super Admin)
  getAllAdmins: async () => {
    const response = await apiClient.get('/admins/getAllAdmins');
    return response.data;
  },

  registerAdmin: async (adminData) => {
    const response = await apiClient.post('/admins/register', adminData);
    return response.data;
  },

  activateAdmin: async (adminId) => {
    const response = await apiClient.patch(`/admins/admin/activate/${adminId}`);
    return response.data;
  },

  deactivateAdmin: async (adminId) => {
    const response = await apiClient.patch(`/admins/admin/deactivate/${adminId}`);
    return response.data;
  },

  // System Dashboard Timeline
  getTransactionTimeline: async () => {
    const response = await apiClient.get('/admins/dashboard/timeline');
    return response.data;
  },

  // System & Website Monitoring
  getSystemMonitoring: async () => {
    const response = await apiClient.get('/admins/dashboard/monitoring');
    return response.data;
  },

  // Executive Dashboard Analytics (Active Users, Admins, Monthly Activity)
  getDashboardAnalytics: async () => {
    const response = await apiClient.get('/admins/dashboard/analytics');
    return response.data;
  },
};

export default adminsApi;
