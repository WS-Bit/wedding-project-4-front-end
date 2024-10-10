import React, { useState, useEffect } from 'react';
import { fetchGuests, submitSongRequest } from '../services/api';
import { sharedStyles } from '../styles/shared';

interface Guest {
    id: number;
    name: string;
}

interface SongSelectionData {
    guest_id: number | null;
    song_title: string;
    artist: string;
}

const SongSelection: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [formData, setFormData] = useState<SongSelectionData>({
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
                setGuests(response.data);
            } catch (err) {
                console.error('Failed to fetch guests', err);
                setError('Failed to load guest list. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadGuests();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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
                setFormData({ ...formData, song_title: '', artist: '' });
            }
        } catch (err) {
            console.error('Error submitting song request:', err);
            setError('Failed to submit song request. Please try again.');
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading guests...</div>;
    }

    return (
        <div className={sharedStyles.pageContainer}>
            <div className={sharedStyles.contentContainer}>
                <h2 className={sharedStyles.heading}>Song Request</h2>
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
                    <div>
                        <label htmlFor="guest_id" className={sharedStyles.label}>
                            Select Your Name
                        </label>
                        <select
                            id="guest_id"
                            name="guest_id"
                            value={formData.guest_id || ''}
                            onChange={handleChange}
                            className={sharedStyles.select}
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
                    <div>
                        <label htmlFor="song_title" className={sharedStyles.label}>
                            Song Title
                        </label>
                        <input
                            type="text"
                            id="song_title"
                            name="song_title"
                            value={formData.song_title}
                            onChange={handleChange}
                            className={sharedStyles.input}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="artist" className={sharedStyles.label}>
                            Artist
                        </label>
                        <input
                            type="text"
                            id="artist"
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            className={sharedStyles.input}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={sharedStyles.button}
                    >
                        Submit Song Request
                    </button>
                </form>
                {error && <p className={sharedStyles.errorText}>{error}</p>}
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default SongSelection;