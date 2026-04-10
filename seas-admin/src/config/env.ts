const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'SEAS Admin Portal';

export const env = {
  API_BASE_URL,
  APP_NAME,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export default env;