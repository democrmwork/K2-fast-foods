/**
 * menuService.js — Menu API calls.
 */
import api from './api';

export const menuService = {
  getAll:    ()     => api.get('/menu'),
  getById:   (id)   => api.get(`/menu/${id}`),
  // Admin
  create:    (data) => api.post('/admin/menu', data),
  update:    (id, data) => api.put(`/admin/menu/${id}`, data),
  delete:    (id)   => api.delete(`/admin/menu/${id}`),
};
