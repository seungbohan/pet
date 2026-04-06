import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password });

export const signup = (data) =>
  client.post('/auth/signup', data);

export const getMe = () =>
  client.get('/users/me');
