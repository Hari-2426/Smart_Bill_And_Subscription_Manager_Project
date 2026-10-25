import apiClient from './client';

export const billsApi = {
  // GET /bills/allBills
  getAllBills: async () => {
    const response = await apiClient.get('/bills/allBills');
    return response.data;
  },

  // GET /bills/overdue
  getOverdueBills: async () => {
    const response = await apiClient.get('/bills/overdue');
    return response.data;
  },

  // GET /bills/billId/{billId}
  getBillById: async (billId) => {
    const response = await apiClient.get(`/bills/billId/${billId}`);
    return response.data;
  },

  // GET /bills/category/{category}
  getBillsByCategory: async (category) => {
    const response = await apiClient.get(`/bills/category/${category}`);
    return response.data;
  },

  // GET /bills/billStatus/{status}
  getBillsByStatus: async (status) => {
    const response = await apiClient.get(`/bills/billStatus/${status}`);
    return response.data;
  },

  // POST /bills/registerBill
  createBill: async (billData) => {
    const response = await apiClient.post('/bills/registerBill', billData);
    return response.data;
  },

  // PATCH /bills/updateBill/{billId}
  updateBill: async (billId, updateData) => {
    const response = await apiClient.patch(`/bills/updateBill/${billId}`, updateData);
    return response.data;
  },

  // DELETE /bills/deleteBill/{billId}
  deleteBill: async (billId) => {
    const response = await apiClient.delete(`/bills/deleteBill/${billId}`);
    return response.data;
  },
};
