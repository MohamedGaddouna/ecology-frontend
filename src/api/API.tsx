import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const API_NO_AUTH = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('ecology_token')) {
    req.headers.authorization = `Bearer ${localStorage.getItem('ecology_token')}`;
  }
  return req;
});

export { API, API_NO_AUTH };
