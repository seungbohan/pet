import client from './client';

export const getPlaces = (params) =>
  client.get('/places', { params });

export const getMapPlaces = () =>
  client.get('/places/map');

export const getPlace = (id) =>
  client.get(`/places/${id}`);

export const searchPlaces = (keyword, category) =>
  client.get('/places/search', { params: { keyword, category } });

export const getAreaCodes = () =>
  client.get('/places/areas');

/* --- 거지맵-inspired features --- */

/** Vote (upvote / downvote) on a place */
export const votePlace = (id, upvote) =>
  client.post(`/places/${id}/vote`, { upvote });

/** Submit a new place (장소 제보) */
export const submitPlace = (data) =>
  client.post('/places/submit', data);

/** Get user-submitted places */
export const getSubmittedPlaces = (page = 0) =>
  client.get('/places/submitted', { params: { page } });

/** Get popular places ranked by upvotes */
export const getPopularPlaces = () =>
  client.get('/places/popular');
