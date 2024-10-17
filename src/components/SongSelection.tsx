import React, { useState, useEffect } from 'react';
import { fetchGuests, submitSongRequest } from '../services/api';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import SearchableGuestDropdown from './SearchableGuestDropdown';
import AnimatedForm from './AnimatedForm';
import { GuestData, SongSelectionData } from '../types';

const SongSelection = () => {
    const [guests, setGuests] = useState<GuestData[]>([]);
    const [formData, setFormData] = useState<SongSelectionData>({
        song_title: '',
        artist: '',
    });
    const [selectedGuestId, setSelectedGuestId] = useState<number | ''>('');
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

    const handleGuestSelect = (guestId: number) => {
        setSelectedGuestId(guestId);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'guest') {
            setSelectedGuestId(value === '' ? '' : Number(value));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedGuestId) {
            setError('Please select a guest before submitting.');
            return;
        }

        try {
            const response = await submitSongRequest(formData, selectedGuestId as number);
            if (response.status === 201) {
                setSuccess('Song request submitted successfully!');
                setFormData({ song_title: '', artist: '' });
                setSelectedGuestId('');
            }
        } catch (err: any) {
            console.error('Error submitting song request:', err);
            setError(`Failed to submit song request: ${err.response?.data?.detail || err.message || 'Unknown error'}`);
        }
    };
    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading guests...</div>;
    }

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.contentContainer}>
                <AnimatedForm onSubmit={handleSubmit} className={sharedStyles.form}>
                    <h2 className={sharedStyles.heading}>Song Request</h2>
                    <SearchableGuestDropdown
                        guests={guests}
                        selectedGuestId={selectedGuestId}
                        onGuestSelect={handleGuestSelect}
                        label="Select Your Name"
                    />
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
                    <button type="submit" className={sharedStyles.button}>
                        Submit Song Request
                    </button>
                    <BackButton className="mt-4" />
                </AnimatedForm>
                {error && <p className={sharedStyles.errorText}>{error}</p>}
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default SongSelection;