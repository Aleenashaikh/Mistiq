import axios from 'axios';

// Set base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_TARGET || 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;

// Log the base URL in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

export default axios;

