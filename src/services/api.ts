import axios from 'axios';
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
            // Handle unauthorized error (e.g., redirect to login)
            console.error('Unauthorized access. Redirecting to login...');
            // Implement redirect logic here if needed
        }
        return Promise.reject(error);
    }
);

export const fetchCsrfToken = async () => {
    const response = await api.get('/csrf_cookie/');
    if (response.data.csrfToken) {
        api.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    }
    return response;
};

export const checkPassword = (password: string) => api.post('/enter_password/', { password });
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