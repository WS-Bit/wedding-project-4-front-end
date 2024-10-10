import React, { useState, useEffect } from 'react';
import { fetchGuests, submitSongRequest } from '../services/api';

interface Guest {
    id: number;
    name: string;
}

interface SongRequestData {
    guest_id: number | null;
    song_title: string;
    artist: string;
}

const SongSelection = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [formData, setFormData] = useState<SongRequestData>({
        guest_id: null,
        song_title: '',
        artist: '',
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGuests = async () => {
            setIsLoading(true);
            try {
                const response = await fetchGuests();
                if (Array.isArray(response.data)) {
                    setGuests(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setError('Failed to load guest list. Unexpected data format.');
                }
            } catch (err) {
                console.error('Failed to fetch guests', err);
                setError('Failed to load guest list. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadGuests();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.guest_id) {
            setError('Please select a guest before submitting.');
            return;
        }

        try {
            const response = await submitSongRequest(formData);
            if (response.status === 201) {
                setSuccess('Song request submitted successfully!');
                setFormData({ guest_id: formData.guest_id, song_title: '', artist: '' });
            }
        } catch (err) {
            console.error('Error submitting song request:', err);
            setError('Failed to submit song request. Please try again.');
        }
    };

    if (isLoading) {
        return <div>Loading guests...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Request a Song</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="guest_id" className="block text-sm font-medium text-gray-700">
                        Select Your Name
                    </label>
                    <select
                        id="guest_id"
                        name="guest_id"
                        value={formData.guest_id || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    >
                        <option value="">Select a guest</option>
                        {guests.map((guest) => (
                            <option key={guest.id} value={guest.id}>
                                {guest.name}
                            </option>
                        ))}
                    </select>
                </div>
                {formData.guest_id && (
                    <>
                        <div>
                            <label htmlFor="song_title" className="block text-sm font-medium text-gray-700">
                                Song Title
                            </label>
                            <input
                                type="text"
                                id="song_title"
                                name="song_title"
                                value={formData.song_title}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                                Artist
                            </label>
                            <input
                                type="text"
                                id="artist"
                                name="artist"
                                value={formData.artist}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit Song Request
                        </button>
                    </>
                )}
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>
    );
};

export default SongSelection;