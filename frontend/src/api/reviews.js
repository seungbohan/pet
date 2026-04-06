import client from './client';

export const getFeedReviews = (feedId, page = 0) =>
  client.get(`/feeds/${feedId}/reviews`, { params: { page } });

export const createFeedReview = (feedId, data) =>
  client.post(`/feeds/${feedId}/reviews`, data);

export const getPlaceReviews = (placeId, page = 0) =>
  client.get(`/places/${placeId}/reviews`, { params: { page } });

export const createPlaceReview = (placeId, data) =>
  client.post(`/places/${placeId}/reviews`, data);

export const updateReview = (id, data) =>
  client.put(`/reviews/${id}`, data);

export const deleteReview = (id) =>
  client.delete(`/reviews/${id}`);

export const getTags = () =>
  client.get('/tags');
