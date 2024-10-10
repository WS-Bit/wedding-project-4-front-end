import React, { useState, useEffect } from 'react';
import { fetchGuests, submitRSVP } from '../services/api';

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
        return <div>Loading guests...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">RSVP</h2>
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
                <div>
                    <label htmlFor="wedding_selection" className="block text-sm font-medium text-gray-700">
                        Which wedding(s) will you attend?
                    </label>
                    <select
                        id="wedding_selection"
                        name="wedding_selection"
                        value={formData.wedding_selection}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">I will be attending</span>
                    </label>
                </div>
                <div>
                    <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
                        Additional Notes
                    </label>
                    <textarea
                        id="additional_notes"
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Submit RSVP
                </button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>
    );
};

export default RSVP;