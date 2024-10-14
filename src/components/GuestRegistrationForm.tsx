import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerGuest, fetchCsrfToken } from '../services/api';
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
    const [isLoading, setIsLoading] = useState(true);
    const [csrfError, setCsrfError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeCsrf = async () => {
            try {
                setIsLoading(true);
                await fetchCsrfToken();
                setCsrfError(null);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
                setCsrfError('Failed to initialize security token. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeCsrf();
    }, []);

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
        if (csrfError) {
            setGeneralError('Cannot submit form due to security token issues. Please refresh the page.');
            return;
        }

        setErrors(guests.map(() => ({})));
        setGeneralError('');
        setSuccess('');

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
                } else if (err.response && err.response.status === 403) {
                    setGeneralError('CSRF verification failed. Please refresh the page and try again.');
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (csrfError) {
        return <div className={sharedStyles.errorText}>{csrfError}</div>;
    }

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Guest Registration</h2>
                {generalError && <p className={sharedStyles.errorText}>{generalError}</p>}
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
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
                    <button type="button" onClick={addGuest} className={sharedStyles.button}>
                        Add Another Guest
                    </button>
                    <button type="submit" className={sharedStyles.button}>
                        Register All Guests
                    </button>
                </form>
                {success && <p className={sharedStyles.successText}>{success}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;