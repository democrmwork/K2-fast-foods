/**
 * orderService.js — Order + delivery tracking API calls.
 */
import api from './api';

export const orderService = {
  place:          (data)  => api.post('/orders', data),
  getMyOrders:    ()      => api.get('/orders'),
  getById:        (id)    => api.get(`/orders/${id}`),
  track:          (id)    => api.get(`/orders/${id}/track`),
  // Admin
  getAll:         (params)=> api.get('/admin/orders', { params }),
  updateStatus:   (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};
