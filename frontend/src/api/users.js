import client from './client';

export const getMyProfile = () =>
  client.get('/users/me');

export const updateProfile = (data) =>
  client.put('/users/me', data);

export const deleteAccount = () =>
  client.delete('/users/me');

export const getMyFeeds = (page = 0) =>
  client.get('/users/me/feeds', { params: { page } });

export const getMyReviews = (page = 0) =>
  client.get('/users/me/reviews', { params: { page } });
