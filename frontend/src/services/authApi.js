import apiService from './api';

export const authApi = {
  login: (credentials) => apiService.login(credentials),
  register: (userData) => apiService.register(userData),
  getProfile: () => apiService.getProfile(),
  updateProfile: (data) => apiService.updateProfile(data),
  forgotPassword: (data) => apiService.forgotPassword(data),
  logout: () => apiService.logout()
};

export default authApi;
