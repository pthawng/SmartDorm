/**
 * Base Axios API client.
 * All API calls across the app should use this client instance.
 */

import axios from 'axios';
import { ENV } from '@/shared/config/env';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach global interceptors
setupInterceptors(apiClient);
