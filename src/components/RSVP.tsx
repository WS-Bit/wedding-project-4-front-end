import React, { useState, useEffect } from 'react';
import { fetchGuests, submitRSVP } from '../services/api';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';

const WEDDING_CHOICES = [
    { value: 'ENG', label: 'England' },
    { value: 'AUS', label: 'Australia' },
    { value: 'BOTH', label: 'Both' },
] as const;

type WeddingChoice = typeof WEDDING_CHOICES[number]['value'];

interface Guest {
    id: number;
    name: string;
}

interface RSVPData {
    guest_id: number | null;
    wedding_selection: WeddingChoice;
    is_attending: boolean;
    additional_notes: string;
}

const RSVP = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [formData, setFormData] = useState<RSVPData>({
        guest_id: null,
        wedding_selection: WEDDING_CHOICES[0].value,
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
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
            const response = await submitRSVP(formData);
            if (response.status === 201) {
                setSuccess('RSVP submitted successfully!');
            }
        } catch (err) {
            console.error('Error submitting RSVP:', err);
            setError('Failed to submit RSVP. Please try again.');
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