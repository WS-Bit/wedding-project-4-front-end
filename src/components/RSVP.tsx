import React, { useState, useEffect } from 'react';
import { fetchGuests, submitRSVP } from '../services/api';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';
import { GuestData, RSVPData } from '../types';
import SearchableGuestDropdown from './SearchableGuestDropdown';

const WEDDING_CHOICES = [
    { value: 'ENG', label: 'England' },
    { value: 'AUS', label: 'Australia' },
    { value: 'BOTH', label: 'Both' },
] as const;

const RSVP = () => {
    const [guests, setGuests] = useState<GuestData[]>([]);
    const [formData, setFormData] = useState<RSVPData>({
        guest: 0,  // Initialize with 0 or another default value
        wedding_selection: 'ENG',
        is_attending: true,
        additional_notes: '',
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

    const handleGuestSelect = (guestId: number) => {
        setFormData(prev => ({ ...prev, guest: guestId }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                name === 'guest' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.guest === 0) {
            setError('Please select a guest before submitting.');
            return;
        }

        try {
            const response = await submitRSVP(formData);
            if (response.status === 201) {
                setSuccess('RSVP submitted successfully!');
            }
        } catch (err: any) {
            console.error('Error details:', err.response?.data);
            setError(`Failed to submit RSVP: ${err.response?.data?.detail || err.message || 'Unknown error'}`);
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading guests...</div>;
    }

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.contentContainer}>
                <AnimatedForm onSubmit={handleSubmit} className={sharedStyles.form}>
                    <h2 className={sharedStyles.heading}>RSVP</h2>
                    <SearchableGuestDropdown
                        guests={guests}
                        selectedGuestId={formData.guest}
                        onGuestSelect={handleGuestSelect}
                        label="Select Your Name"
                    />
                    <div>
                        <label htmlFor="wedding_selection" className={sharedStyles.label}>
                            Which wedding(s) will you attend?
                        </label>
                        <select
                            id="wedding_selection"
                            name="wedding_selection"
                            value={formData.wedding_selection}
                            onChange={handleChange}
                            className={sharedStyles.select}
                        >
                            {WEDDING_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_attending"
                                checked={formData.is_attending}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-gray-700">I will be attending</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="additional_notes" className={sharedStyles.label}>
                            Additional Notes
                        </label>
                        <textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                            rows={3}
                            className={sharedStyles.input}
                        />
                    </div>
                    <button type="submit" className={sharedStyles.button}>
                        Submit RSVP
                    </button>
                    <BackButton className="mt-4" />
                </AnimatedForm>
                {error && <p className={sharedStyles.errorText}>{error}</p>}
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default RSVP;