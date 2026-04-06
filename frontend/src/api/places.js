import client from './client';

export const getPlaces = (params) =>
  client.get('/places', { params });

export const getMapPlaces = () =>
  client.get('/places/map');

export const getPlace = (id) =>
  client.get(`/places/${id}`);

export const searchPlaces = (keyword, category) =>
  client.get('/places/search', { params: { keyword, category } });
