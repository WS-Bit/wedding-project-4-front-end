import axios, { AxiosError } from 'axios';
import { GuestData } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

function getCsrfToken() {
    console.log('All cookies:', document.cookie);
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    console.log('Found CSRF token:', csrfToken);
    return csrfToken;
}

api.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    console.log('CSRF Token being sent:', csrfToken);
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access. Redirecting to login...');
            // You can add logic here to redirect to login page if needed
        }
        return Promise.reject(error);
    }
);

export const fetchCsrfToken = async () => {
    try {
        console.log('Fetching CSRF token...');
        const response = await api.get('/api/csrf_cookie/', {
            withCredentials: true,
        });

        console.log('CSRF response:', response);
        console.log('All cookies after fetch:', document.cookie);

        // Look for the CSRF token in the response headers
        const csrfToken = response.headers['x-csrftoken'] || response.headers['X-CSRFToken'];
        if (csrfToken) {
            console.log('CSRF Token found in headers:', csrfToken);
            document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Lax`;
            return csrfToken;
        }

        // If not in headers, check cookies
        const cookieToken = getCsrfToken();
        if (cookieToken) {
            console.log('CSRF Token found in cookies:', cookieToken);
            return cookieToken;
        }

        console.error('CSRF token not found in headers or cookies');
        return null;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
};

export const checkPassword = async (password: string) => {
    try {
        const csrfToken = await fetchCsrfToken();

        const formData = new URLSearchParams();
        formData.append('password', password);

        const headers: Record<string, string> = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        const response = await api.post('/api/enter_password/', formData, {
            headers,
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        // Existing error handling
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Axios error in checkPassword:', axiosError.response?.data || axiosError.message);
            if (axiosError.response) {
                console.error('Status:', axiosError.response.status);
                console.error('Headers:', axiosError.response.headers);
            }
        } else {
            console.error('Unknown error in checkPassword:', error);
        }
        throw error;
    }
};

// The rest of your API functions remain the same
export const registerGuest = (guestData: GuestData) =>
    api.post('/api/guests/', JSON.stringify(guestData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const fetchGuests = () => api.get('/guests/');

export const submitRSVP = (rsvpData: any) =>
    api.post('/api/rsvp/', JSON.stringify(rsvpData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const submitSongRequest = (songData: any) =>
    api.post('/api/songrequests/', JSON.stringify(songData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const submitMemory = (memoryData: { guest_id: number; memory_text: string }) =>
    api.post('/api/memories/', JSON.stringify(memoryData), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const fetchAllMemories = () => api.get('api/memories/all/');

export const checkAuthStatus = () => api.get('api/auth_status/');

export default api;