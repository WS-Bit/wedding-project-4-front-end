import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DIETARY_CHOICES = [
    { value: 'N/A', label: 'Not Applicable' },
    { value: 'VEG', label: 'Vegetarian' },
    { value: 'VGN', label: 'Vegan' },
    { value: 'GF', label: 'Gluten-Free' },
    { value: 'NUT', label: 'Nut-Free' },
    { value: 'LAC', label: 'Lactose-Free' },
    { value: 'SPE', label: 'Specific' },
] as const;

type DietaryChoice = typeof DIETARY_CHOICES[number]['value'];

interface GuestData {
    name: string;
    email: string;
    phone: string;
    dietary_restrictions: DietaryChoice;
    specific_dietary_restrictions: string;
}

const GuestRegistrationForm = () => {
    const [guests, setGuests] = useState<GuestData[]>([{
        name: '',
        email: '',
        phone: '',
        dietary_restrictions: 'N/A',
        specific_dietary_restrictions: '',
    }]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.defaults.withCredentials = true;
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        }
    }, []);

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGuests(prevGuests => prevGuests.map((guest, i) => 
            i === index ? { ...guest, [name]: value } : guest
        ));
    };

    const addGuest = () => {
        setGuests(prevGuests => [...prevGuests, {
            name: '',
            email: '',
            phone: '',
            dietary_restrictions: 'N/A',
            specific_dietary_restrictions: '',
        }]);
    };

    const removeGuest = (index: number) => {
        setGuests(prevGuests => prevGuests.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        for (const guest of guests) {
            try {
                console.log('Submitting guest:', JSON.stringify(guest, null, 2));
                const response = await axios.post<GuestData>('/api/guests/', guest, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') || '',
                    },
                });
                console.log('Response:', response);
                if (response.status !== 201) {
                    throw new Error(`Failed to register guest ${guest.name}`);
                }
            } catch (err) {
                console.error('Full error object:', err);
                let errorMessage = `Failed to register ${guest.name}: `;

                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        console.error('Error response:', err.response);
                        console.error('Error data:', err.response.data);
                        console.error('Error status:', err.response.status);
                        console.error('Error headers:', err.response.headers);
                        errorMessage += JSON.stringify(err.response.data) || err.message;
                    } else if (err.request) {
                        console.error('Error request:', err.request);
                        errorMessage += 'No response received from server';
                    } else {
                        errorMessage += err.message;
                    }
                } else {
                    errorMessage += 'An unexpected error occurred';
                }

                setError(prev => prev + errorMessage + '\n');
                return; // Stop processing further guests if there's an error
            }
        }

        if (!error) {
            localStorage.setItem('isGuestRegistered', 'true');
            navigate('/home');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Guest Registration</h2>
                <form onSubmit={handleSubmit}>
                    {guests.map((guest, index) => (
                        <div key={index} className="mb-6 p-4 border rounded">
                            <h3 className="text-lg font-semibold mb-2">Guest {index + 1}</h3>
                            <input
                                type="text"
                                name="name"
                                value={guest.name}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border rounded"
                                placeholder="Full Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={guest.email}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border rounded"
                                placeholder="Email"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={guest.phone}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border rounded"
                                placeholder="Phone Number"
                                required
                            />
                            <select
                                name="dietary_restrictions"
                                value={guest.dietary_restrictions}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border rounded"
                            >
                                {DIETARY_CHOICES.map(choice => (
                                    <option key={choice.value} value={choice.value}>
                                        {choice.label}
                                    </option>
                                ))}
                            </select>
                            {guest.dietary_restrictions === 'SPE' && (
                                <textarea
                                    name="specific_dietary_restrictions"
                                    value={guest.specific_dietary_restrictions}
                                    onChange={handleChange(index)}
                                    className="w-full p-2 mb-4 border rounded"
                                    placeholder="Please specify your dietary restrictions"
                                />
                            )}
                            {guests.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeGuest(index)}
                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Remove Guest
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addGuest}
                        className="w-full p-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add Another Guest
                    </button>
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Register All Guests
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;