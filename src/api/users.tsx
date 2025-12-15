import { API } from './API';

export const getUser = (id: number | string) => API.get(`api/users/${id}`);
export const getUsers = () => API.get('api/users');
export const updateUser = (id: number | string, data: any) => API.put(`api/users/${id}`, data);
export const createUser = (data: any) => API.post('api/users', data);
export const deleteUser = (id: number | string) => API.delete(`api/users/${id}`);
