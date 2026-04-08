import axios from 'axios';
import useToastStore from '../store/toastStore';

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      useToastStore.getState().addToast('세션이 만료되었습니다. 다시 로그인해주세요.', 'warning');
      localStorage.removeItem('token');
      // Delay redirect slightly so toast is visible
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } else if (status) {
      // Parse backend ApiErrorResponse format { code, message }
      const message = data?.message || error.message || '오류가 발생했습니다.';
      useToastStore.getState().addToast(message, 'error');
    }

    return Promise.reject(error);
  }
);

export default client;
