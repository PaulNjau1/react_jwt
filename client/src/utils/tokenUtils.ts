// src/utils/tokenUtils.ts
import axios from 'axios';

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const response = await axios.post('http://localhost:5000/api/token', { token: refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken); // Store the new access token
        return accessToken;
    } catch (error) {
        console.error('Failed to refresh token', error);
        // Handle token refresh error (e.g., redirect to login)
        return null;
    }
};
