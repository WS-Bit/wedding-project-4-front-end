import axios, { AxiosError } from 'axios';
import { GuestData } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

function getCsrfToken() {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
}

api.interceptors.request.use(config => {
    config.headers['X-CSRFToken'] = getCsrfToken();
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access. Redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export const fetchCsrfToken = async () => {
    try {
        const response = await api.get('/csrf_cookie/');
        console.log('CSRF response:', response);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // This is an Axios error
            const axiosError = error as AxiosError;
            console.error('CSRF fetch error:', axiosError.response?.data || axiosError.message);
        } else {
            // This is an unknown error
            console.error('Unknown error during CSRF fetch:', error);
        }
        throw error;
    }
};

export const checkPassword = async (password: string) => {
    const response = await api.post('/enter_password/', { password });
    if (response.data.csrfToken) {
        api.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    }
    return response;
};

export const registerGuest = (guestData: GuestData) => api.post('/guests/', guestData);
export const fetchGuests = () => api.get('/guests/');
export const submitRSVP = (rsvpData: any) => api.post('/rsvp/', rsvpData);
export const submitSongRequest = (songData: any) => api.post('/songrequests/', songData);
export const submitMemory = (memoryData: { guest_id: number; memory_text: string }) => {
    return api.post('/memories/', memoryData);
};
export const fetchAllMemories = () => api.get('/memories/all/');

export const checkAuthStatus = () => api.get('/auth_status/');

export default api;