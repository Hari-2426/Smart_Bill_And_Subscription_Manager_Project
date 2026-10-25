import apiClient from './client';

export const paymentsApi = {
  // POST /payments/paybill
  payBill: async (paymentData) => {
    const response = await apiClient.post('/payments/paybill', paymentData);
    return response.data;
  },

  // GET /payments/history
  getPaymentHistory: async () => {
    const response = await apiClient.get('/payments/history');
    return response.data;
  },

  // GET /payments/{paymentId}
  getPaymentById: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  // GET /payments/bill/{billId}
  getPaymentsByBillId: async (billId) => {
    const response = await apiClient.get(`/payments/bill/${billId}`);
    return response.data;
  },

  // GET /payments/status/{status}
  getPaymentsByStatus: async (status) => {
    const response = await apiClient.get(`/payments/status/${status}`);
    return response.data;
  },
};
