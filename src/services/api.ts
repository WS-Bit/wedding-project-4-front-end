import axios from 'axios';
import { GuestData } from '../types';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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

export const fetchCsrfToken = () => api.get('/csrf_cookie/');
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