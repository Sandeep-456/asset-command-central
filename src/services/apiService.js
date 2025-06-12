
import { api } from './authService';

export const apiService = {
  // Dashboard
  async getDashboardMetrics(filters = {}) {
    const response = await api.get('/dashboard/metrics', { params: filters });
    return response.data;
  },

  async getNetMovementDetails(filters = {}) {
    const response = await api.get('/dashboard/net-movement', { params: filters });
    return response.data;
  },

  // Assets
  async getAssets(filters = {}) {
    const response = await api.get('/assets', { params: filters });
    return response.data;
  },

  async createAsset(assetData) {
    const response = await api.post('/assets', assetData);
    return response.data;
  },

  // Purchases
  async getPurchases(filters = {}) {
    const response = await api.get('/purchases', { params: filters });
    return response.data;
  },

  async createPurchase(purchaseData) {
    const response = await api.post('/purchases', purchaseData);
    return response.data;
  },

  // Transfers
  async getTransfers(filters = {}) {
    const response = await api.get('/transfers', { params: filters });
    return response.data;
  },

  async createTransfer(transferData) {
    const response = await api.post('/transfers', transferData);
    return response.data;
  },

  // Assignments
  async getAssignments(filters = {}) {
    const response = await api.get('/assignments', { params: filters });
    return response.data;
  },

  async createAssignment(assignmentData) {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  // Expenditures
  async getExpenditures(filters = {}) {
    const response = await api.get('/expenditures', { params: filters });
    return response.data;
  },

  async createExpenditure(expenditureData) {
    const response = await api.post('/expenditures', expenditureData);
    return response.data;
  },

  // Users (Admin only)
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Reference data
  async getBases() {
    const response = await api.get('/bases');
    return response.data;
  },

  async getEquipmentTypes() {
    const response = await api.get('/equipment-types');
    return response.data;
  },

  async getRoles() {
    const response = await api.get('/roles');
    return response.data;
  }
};
