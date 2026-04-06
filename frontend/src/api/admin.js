import client from './client';

export const getStats = () =>
  client.get('/admin/stats');

export const getUsers = (page = 0) =>
  client.get('/admin/users', { params: { page } });

export const changeUserRole = (id, role) =>
  client.put(`/admin/users/${id}/role`, { role });

export const deleteUser = (id) =>
  client.delete(`/admin/users/${id}`);

export const getAdminFeeds = (page = 0) =>
  client.get('/admin/feeds', { params: { page } });

export const deleteAdminFeed = (id) =>
  client.delete(`/admin/feeds/${id}`);
