import client from './client';

export const getFeeds = (page = 0, size = 12) =>
  client.get('/feeds', { params: { page, size } });

export const getPopularFeeds = (page = 0, size = 12) =>
  client.get('/feeds/popular', { params: { page, size } });

export const getFeed = (id) =>
  client.get(`/feeds/${id}`);

export const createFeed = (data) =>
  client.post('/feeds', data);

export const updateFeed = (id, data) =>
  client.put(`/feeds/${id}`, data);

export const deleteFeed = (id) =>
  client.delete(`/feeds/${id}`);
