// src/axiosInstance.ts
import axios from 'axios';
import { refreshAccessToken } from './tokenUtils';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token (status code 401)
        if (error.response.status === 401) {
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                // Set the new access token in the original request's headers
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest); // Retry the original request
            } else {
                // If the refresh failed, handle logout or redirect
                // e.g., redirect to login page
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
