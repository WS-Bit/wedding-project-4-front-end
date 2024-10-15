import axios, { AxiosError } from 'axios';
import { GuestData, RSVPData, SongSelectionData } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

const getToken = (): string | null => localStorage.getItem('token');
const removeToken = (): void => localStorage.removeItem('token');

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const checkPassword = async (password: string): Promise<boolean> => {
    try {
        const response = await api.post<{ token: string }>('/enter_password/', { password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
};

export const registerGuest = (guestData: GuestData) => api.post<GuestData>('/guests/', guestData);

export const checkAuthStatus = () => api.get<{ isAuthenticated: boolean }>('/auth/status/');

export const fetchGuests = () => api.get<GuestData[]>('/guests/');

export const submitRSVP = (rsvpData: RSVPData) => {
    // Ensure guest is sent as an ID
    const dataToSend = {
        ...rsvpData,
        guest: rsvpData.guest
    };
    return api.post<RSVPData>('/rsvp/', dataToSend);
};

export const submitSongRequest = (songData: SongSelectionData, guestId: number) =>
    api.post<SongSelectionData>('/songrequests/', { ...songData, guest_id: guestId });

export const submitMemory = (memoryData: { guest_id: number; memory_text: string }) =>
    api.post<{ guest_id: number; memory_text: string }>('/memories/', memoryData);

export const fetchAllMemories = () => api.get<any[]>('/memories/all/');

export default api;