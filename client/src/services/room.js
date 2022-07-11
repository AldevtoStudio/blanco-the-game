import api from './api';

export const listRooms = () => api.get('/room').then((response) => response.data);

export const createRoom = (body) =>
  api.post('/room/create', body).then((response) => response.data);

export const updateRoomByCode = (code, body) =>
  api.patch(`/room/${code}`, body).then((response) => response.data);

export const deleteRoom = (code) => api.detele(`/room/${code}`).then((response) => response.data);

export const getRoom = (code) => api.get(`/room/${code}`).then((response) => response.data);

export const getRoomByCode = (code) => api.get(`/room/${code}`).then((response) => response.data);

export const selectRandomBlanco = (code) =>
  api.get(`/room/${code}/random-blanco`).then((response) => response.data);
