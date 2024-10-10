import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerGuest, fetchCsrfToken } from '../services/api';
import { GuestData, DIETARY_CHOICES, } from '../types';
import CustomPhoneInput from './CustomPhoneInput';

const GuestRegistrationForm = () => {
    const [guests, setGuests] = useState<GuestData[]>([{
        name: '',
        email: '',
        phone: '',
        dietary_restrictions: 'N/A',
        specific_dietary_restrictions: '',
    }]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCsrfToken();
    }, []);

    const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGuests(prevGuests => prevGuests.map((guest, i) =>
            i === index ? { ...guest, [name]: value } : guest
        ));
    };

    const handlePhoneChange = (index: number) => (value: string) => {
        setGuests(prevGuests => prevGuests.map((guest, i) =>
            i === index ? { ...guest, phone: value } : guest
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
        setSuccess('');

        let allGuestsRegistered = true;

        for (const guest of guests) {
            try {
                console.log('Submitting guest:', JSON.stringify(guest, null, 2));
                const response = await registerGuest(guest);
                console.log('Response:', response);
                if (response.status !== 201) {
                    throw new Error(`Failed to register guest ${guest.name}`);
                }
            } catch (err) {
                console.error('Full error object:', err);
                let errorMessage = `Failed to register ${guest.name}: `;

                if (err instanceof Error) {
                    errorMessage += err.message;
                } else {
                    errorMessage += 'An unexpected error occurred';
                }

                setError(prev => prev + errorMessage + '\n');
                allGuestsRegistered = false;
            }
        }

        if (allGuestsRegistered) {
            setSuccess('All guests registered successfully!');
            localStorage.setItem('isGuestRegistered', 'true');
            setTimeout(() => navigate('/home'), 2000);  // Navigate after 2 seconds
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
                            <CustomPhoneInput
                                value={guest.phone}
                                onChange={handlePhoneChange(index)}
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
                {success && <p className="mt-4 text-green-500">{success}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;