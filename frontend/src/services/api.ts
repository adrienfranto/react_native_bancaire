import axios from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator to access local backend, or localhost for iOS/web.
const BASE_URL = Platform.OS === 'android' ? 'http://192.168.88.13:8000' : 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
