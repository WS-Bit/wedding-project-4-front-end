import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',  // Adjust this to your Django server's URL
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

export const checkPassword = (password: string) => api.post('/api/enter_password/', { password });
export const registerGuest = (guestData: FormData) => api.post('/api/guests/', guestData);

// Add this function to check authentication status
export const checkAuthStatus = () => api.get('/api/auth_status/');