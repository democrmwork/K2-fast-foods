/**
 * authService.js
 * Purpose:        Auth-related API calls.
 * Responsibility: register, login, getProfile.
 */
import api from './api';

export const authService = {
  register: (data)    => api.post('/auth/register', data),
  login:    (data)    => api.post('/auth/login',    data),
  getProfile:()       => api.get('/auth/profile'),
  logout:   ()        => api.post('/auth/logout'),
};
