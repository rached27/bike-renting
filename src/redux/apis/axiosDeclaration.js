import defaultAxios from 'axios';
import envs from '../../config/env';

// Get URL from envirement variables
const {URL} = envs;

const axios = defaultAxios.create({
  baseURL: URL,
  headers: {'Content-Type': 'application/json'},
});

export default axios;