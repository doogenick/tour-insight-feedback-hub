
import axios from 'axios';
import localforage from 'localforage';

// Initialize localforage
localforage.config({
  name: 'tour-feedback-app',
  storeName: 'feedbackData'
});

// Define base URL for API
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-url.com/api' 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export { api, localforage };
