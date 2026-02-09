import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    // Direct connection to backend - bypasses Vite proxy to avoid path issues
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Important for CORS
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in every request
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        if (session?.access_token) {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
