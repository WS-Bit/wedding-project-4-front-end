import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Adjust this to your Django server URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkPassword = (password: string) => api.post('/enter-password/', { password });
export const registerGuest = (guestData: any) => api.post('/guests/', guestData);
export const getGuestInfo = () => api.get('/guests/');
export const submitRSVP = (rsvpData: any) => api.post('/rsvp/', rsvpData);
export const submitSongRequest = (songData: any) => api.post('/songrequests/', songData);
export const submitMemory = (memoryData: any) => api.post('/memories/', memoryData);

export default api;