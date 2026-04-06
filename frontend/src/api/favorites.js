import client from './client';

export const getMyFavorites = () =>
  client.get('/favorites');

export const toggleFavorite = (placeId) =>
  client.post(`/favorites/${placeId}`);

export const checkFavorite = (placeId) =>
  client.get(`/places/${placeId}/favorite`);
