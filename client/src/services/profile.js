import api from "./api";

export const profileLoad = (id) => api.get(`/profile/${id}`).then((response) => response.data);

export const profileEdit = (body) => api.patch("/profile", body).then((response) => response.data);
