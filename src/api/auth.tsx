import { API_NO_AUTH } from './API';

export const signup = (signupData : any) => API_NO_AUTH.post('api/users/signup', signupData);
export const login = (data : any) => API_NO_AUTH.post('api/users/login', data);
