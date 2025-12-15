import { API } from './API';

export const getComplains = () => API.get('api/complains');
export const getComplain = (id: number | string) => API.get(`api/complains/${id}`);
export const createComplain = (data: any) => API.post('api/complains', data);
export const updateComplain = (id: number | string, data: any) => API.put(`api/complains/${id}`, data);
export const deleteComplain = (id: number | string) => API.delete(`api/complains/${id}`);
