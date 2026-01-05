import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = "https://dev.kitchen-os.online";

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data?.data ? { ...response, data: response.data.data } : response;
    },
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('auth_token');
        }

        const message = (error.response?.data as any)?.message || error.message || 'Something went wrong';
        return Promise.reject({
            message: Array.isArray(message) ? message[0] : message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export default apiClient;