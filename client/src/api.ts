import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';
import { toast } from 'sonner';

const api = axios.create({
    // Use environment variable for production, fallback to localhost for development
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
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

// Add a response interceptor to handle common errors automatically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle Network Errors (Backend not running)
        if (error.code === 'ERR_NETWORK') {
            toast.error("Backend Server Not Reachable", {
                description: "Is the server running? Check backend terminal.",
                duration: 5000,
            });
            console.error("[Auto-Diagnose] Network Error - Backend likely down");
        }

        // Handle 404 Errors (Wrong URL)
        else if (error.response?.status === 404) {
            toast.error("API Endpoint Not Found", {
                description: `URL: ${error.config.url} - Check backend logs!`,
                duration: 5000,
            });
            console.error(`[Auto-Diagnose] 404 Not Found: ${error.config.url}`);
        }

        // Handle 401 Errors (Not Logged In)
        else if (error.response?.status === 401) {
            toast.warning("Authentication Required", {
                description: "Please login again to continue.",
            });
        }

        return Promise.reject(error);
    }
);

export default api;
