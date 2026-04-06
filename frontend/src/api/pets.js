import client from './client';

export const getMyPets = () =>
  client.get('/pets');

export const createPet = (data) =>
  client.post('/pets', data);

export const updatePet = (id, data) =>
  client.put(`/pets/${id}`, data);

export const deletePet = (id) =>
  client.delete(`/pets/${id}`);
