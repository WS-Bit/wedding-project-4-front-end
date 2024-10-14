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
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

api.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    console.log('CSRF Token being sent:', csrfToken);
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export const fetchCsrfToken = async () => {
    try {
        const response = await api.get('/csrf_cookie/', {
            withCredentials: true
        });
        console.log('CSRF response:', response);
        console.log('All cookies after fetch:', document.cookie);
        return response;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

export const checkPassword = async (password: string) => {
    try {
        const formData = new URLSearchParams();
        formData.append('password', password);

        const response = await api.post('/enter_password/', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // This is an Axios error
            const axiosError = error as AxiosError;
            console.error('Axios error in checkPassword:', axiosError.response?.data || axiosError.message);
            if (axiosError.response) {
                console.error('Status:', axiosError.response.status);
                console.error('Headers:', axiosError.response.headers);
            }
        } else {
            // This is an unknown error
            console.error('Unknown error in checkPassword:', error);
        }
        throw error;
    }
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