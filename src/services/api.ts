import axios, { AxiosError } from 'axios';
import { GuestData } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

function getCsrfToken() {
    console.log('All cookies:', document.cookie);
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    console.log('Found CSRF token:', token);
    return token;
}

api.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    console.log('CSRF Token being sent:', csrfToken);
    config.headers['X-CSRFToken'] = csrfToken;
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
        const token = getCsrfToken();
        if (!token) {
            console.error('CSRF token not found after fetch');
        }
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('CSRF fetch error:', axiosError.response?.data || axiosError.message);
        } else {
            console.error('Unknown error during CSRF fetch:', error);
        }
        throw error;
    }
};

export const checkPassword = async (password: string) => {
    const response = await api.post('/enter_password/', JSON.stringify({ password }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.data.csrfToken) {
        api.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    }
    return response;
};

export const registerGuest = (guestData: GuestData) =>
    api.post('/guests/', JSON.stringify(guestData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const fetchGuests = () => api.get('/guests/');

export const submitRSVP = (rsvpData: any) =>
    api.post('/rsvp/', JSON.stringify(rsvpData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const submitSongRequest = (songData: any) =>
    api.post('/songrequests/', JSON.stringify(songData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const submitMemory = (memoryData: { guest_id: number; memory_text: string }) =>
    api.post('/memories/', JSON.stringify(memoryData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const fetchAllMemories = () => api.get('/memories/all/');

export const checkAuthStatus = () => api.get('/auth_status/');

export default api;