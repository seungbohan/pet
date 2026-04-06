import client from './client';

export const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('uploadFiles', file));
  return client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const removeFile = (fileName) =>
  client.delete('/upload', { params: { fileName } });

export const getImageUrl = (fileName) =>
  `/api/v1/upload/display?fileName=${encodeURIComponent(fileName)}`;
