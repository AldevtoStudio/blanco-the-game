import api from './api';

export const suggestTheme = (body) =>
  api.post('/theme/create', body).then((response) => response.data);

export const getTheme = () => api.get('/theme/random').then((response) => response.data);
