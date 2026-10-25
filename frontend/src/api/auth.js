import apiClient from './client';

export const authApi = {
  // POST /users/auth/login
  login: async (credentials) => {
    const response = await apiClient.post('/users/auth/login', credentials);
    return response.data;
  },

  // POST /users/auth/register
  register: async (userData) => {
    const response = await apiClient.post('/users/auth/register', userData);
    return response.data;
  },

  // GET /users/auth/profile
  getProfile: async () => {
    const response = await apiClient.get('/users/auth/profile');
    return response.data;
  },

  // PATCH /users/auth/updateProfile
  updateProfile: async (updatedData) => {
    const response = await apiClient.patch('/users/auth/updateProfile', updatedData);
    return response.data;
  },

  // PUT /users/auth/updatePassword
  updatePassword: async (passwordData) => {
    const response = await apiClient.put('/users/auth/updatePassword', passwordData);
    return response.data;
  },

  // DELETE /users/auth/delete
  deleteAccount: async () => {
    const response = await apiClient.delete('/users/auth/delete');
    return response.data;
  },
};
