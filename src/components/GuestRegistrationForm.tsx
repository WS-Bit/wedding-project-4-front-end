import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerGuest, fetchCsrfToken } from '../services/api';
import { GuestData, DIETARY_CHOICES, } from '../types';
import CustomPhoneInput from './CustomPhoneInput';
import { sharedStyles } from '../styles/shared';

const GuestRegistrationForm = () => {
    const [guests, setGuests] = useState<GuestData[]>([{
        name: '',
        email: '',
        phone: '',
        dietary_restrictions: '',
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
            dietary_restrictions: '',
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
                const response = await registerGuest(guest);
                if (response.status !== 201) {
                    throw new Error(`Failed to register guest ${guest.name}`);
                }
            } catch (err) {
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
            setTimeout(() => navigate('/home'), 2000);
        }
    };

    return (
        <div className={sharedStyles.pageContainer}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Guest Registration</h2>
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
                    {guests.map((guest, index) => (
                        <div key={index} className="mb-6 p-4 border rounded border-pink-200">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Guest {index + 1}</h3>
                            <input
                                type="text"
                                name="name"
                                value={guest.name}
                                onChange={handleChange(index)}
                                className={sharedStyles.input}
                                placeholder="Full Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={guest.email}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition"
                                placeholder="Email Address"
                                required
                            />
                            <CustomPhoneInput
                                value={guest.phone}
                                onChange={handlePhoneChange(index)}
                                placeholder="Phone Number"
                            />
                            <select
                                name="dietary_restrictions"
                                value={guest.dietary_restrictions}
                                onChange={handleChange(index)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition"
                                required
                            >
                                <option value="" disabled>Select Dietary Restrictions</option>
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
                                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition"
                                    placeholder="Please specify your dietary restrictions"
                                />
                            )}
                            {guests.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeGuest(index)}
                                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                >
                                    Remove Guest
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addGuest} className={sharedStyles.button}>
                        Add Another Guest
                    </button>
                    <button type="submit" className={sharedStyles.button}>
                        Register All Guests
                    </button>
                </form>
                {error && <p className={sharedStyles.errorText}>{error}</p>}
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;