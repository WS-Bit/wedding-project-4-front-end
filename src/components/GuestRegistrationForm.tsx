import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerGuest } from '../services/api';
import { GuestData, DIETARY_CHOICES } from '../types';
import CustomPhoneInput from './CustomPhoneInput';
import { sharedStyles } from '../styles/shared';

type ErrorState = Record<string, string | undefined>;

const GuestRegistrationForm = () => {
    const [guests, setGuests] = useState<GuestData[]>([{
        name: '',
        email: '',
        phone: '',
        dietary_restrictions: '',
        specific_dietary_restrictions: '',
    }]);
    const [errors, setErrors] = useState<ErrorState[]>([{}]);
    const [generalError, setGeneralError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGuests(prevGuests => prevGuests.map((guest, i) =>
            i === index ? { ...guest, [name]: value } : guest
        ));
        setErrors(prevErrors => prevErrors.map((error, i) =>
            i === index ? { ...error, [name]: undefined } : error
        ));
    };

    const handlePhoneChange = (index: number) => (value: string) => {
        setGuests(prevGuests => prevGuests.map((guest, i) =>
            i === index ? { ...guest, phone: value } : guest
        ));
        setErrors(prevErrors => prevErrors.map((error, i) =>
            i === index ? { ...error, phone: undefined } : error
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
        setErrors(prevErrors => [...prevErrors, {}]);
    };

    const removeGuest = (index: number) => {
        setGuests(prevGuests => prevGuests.filter((_, i) => i !== index));
        setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(guests.map(() => ({})));
        setGeneralError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setGeneralError('Authentication required. Please log in again.');
            navigate('/');
            return;
        }

        let allGuestsRegistered = true;

        for (let i = 0; i < guests.length; i++) {
            const guest = guests[i];
            try {
                const response = await registerGuest(guest);
                if (response.status !== 201) {
                    throw response;
                }
            } catch (err: any) {
                allGuestsRegistered = false;
                if (err.response && err.response.status === 400) {
                    setErrors(prevErrors => {
                        const newErrors = [...prevErrors];
                        newErrors[i] = Object.fromEntries(
                            Object.entries(err.response.data).map(([key, value]) => [
                                key,
                                typeof value === 'string'
                                    ? value.charAt(0).toUpperCase() + value.slice(1)
                                    : Array.isArray(value)
                                        ? value[0].charAt(0).toUpperCase() + value[0].slice(1)
                                        : value
                            ])
                        );
                        return newErrors;
                    });
                } else if (err.response && err.response.status === 401) {
                    setGeneralError('Authentication failed. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/');
                    return;
                } else {
                    setGeneralError('An unexpected error occurred. Please try again.');
                }
            }
        }

        if (allGuestsRegistered) {
            setSuccess('All guests registered successfully!');
            localStorage.setItem('isGuestRegistered', 'true');
            setTimeout(() => navigate('/home'), 2000);
        }
    };

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Guest Registration</h2>
                {generalError && <p className={sharedStyles.errorText}>{generalError}</p>}
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
                    <div className={sharedStyles.guestRegistrationScrollableContainer}>
                        {guests.map((guest, index) => (
                            <div key={index} className="mb-6 p-4 border rounded border-pink-200">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">Guest {index + 1}</h3>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={guest.name}
                                    onChange={handleChange(index)}
                                    className={`${sharedStyles.input} ${errors[index]?.name ? 'border-red-500' : ''}`}
                                    placeholder="Full Name"
                                    required
                                />
                                {errors[index]?.name && <p className={sharedStyles.errorText}>{errors[index].name}</p>}
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={guest.email}
                                    onChange={handleChange(index)}
                                    className={`${sharedStyles.input} ${errors[index]?.email ? 'border-red-500' : ''}`}
                                    placeholder="Email Address"
                                    required
                                />
                                {errors[index]?.email && <p className={sharedStyles.errorText}>{errors[index].email}</p>}
                            </div>
                            <div className="mb-4">
                                <CustomPhoneInput
                                    value={guest.phone}
                                    onChange={handlePhoneChange(index)}
                                    placeholder="Phone Number"
                                />
                                {errors[index]?.phone && <p className={sharedStyles.errorText}>{errors[index].phone}</p>}
                            </div>
                            <div className="mb-4">
                                <select
                                    name="dietary_restrictions"
                                    value={guest.dietary_restrictions}
                                    onChange={handleChange(index)}
                                    className={`${sharedStyles.input} ${errors[index]?.dietary_restrictions ? 'border-red-500' : ''}`}
                                    required
                                >
                                    <option value="" disabled>Select Dietary Restrictions</option>
                                    {DIETARY_CHOICES.map(choice => (
                                        <option key={choice.value} value={choice.value}>
                                            {choice.label}
                                        </option>
                                    ))}
                                </select>
                                {errors[index]?.dietary_restrictions && <p className={sharedStyles.errorText}>{errors[index].dietary_restrictions}</p>}
                            </div>
                            {guest.dietary_restrictions === 'SPE' && (
                                <div className="mb-4">
                                    <textarea
                                        name="specific_dietary_restrictions"
                                        value={guest.specific_dietary_restrictions}
                                        onChange={handleChange(index)}
                                        className={`${sharedStyles.input} ${errors[index]?.specific_dietary_restrictions ? 'border-red-500' : ''}`}
                                        placeholder="Please specify your dietary restrictions"
                                    />
                                    {errors[index]?.specific_dietary_restrictions && <p className={sharedStyles.errorText}>{errors[index].specific_dietary_restrictions}</p>}
                                </div>
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
                    </div>
                    <div className="mt-4 space-y-4">
                        <button type="button" onClick={addGuest} className={`${sharedStyles.button} w-full`}>
                            Add Another Guest
                        </button>
                        <button type="submit" className={`${sharedStyles.button} w-full`}>
                            Register All Guests
                        </button>
                    </div>
                </form>
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;