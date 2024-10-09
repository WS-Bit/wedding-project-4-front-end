import React, { useState, ChangeEvent, FormEvent } from 'react';
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

interface FormData {
    name: string;
    email: string;
    phone: string;
    dietary_restrictions: DietaryChoice;
    specific_dietary_restrictions: string;
}

const GuestRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        dietary_restrictions: 'N/A',
        specific_dietary_restrictions: '',
    });
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post<FormData>('/api/guests/', formData);
            if (response.status === 201) {
                localStorage.setItem('isGuestRegistered', 'true');
                navigate('/home');
            }
        } catch (err) {
            setError('Failed to register. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Guest Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="Phone Number"
                        required
                    />
                    <select
                        name="dietary_restrictions"
                        value={formData.dietary_restrictions}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                    >
                        {DIETARY_CHOICES.map(choice => (
                            <option key={choice.value} value={choice.value}>
                                {choice.label}
                            </option>
                        ))}
                    </select>
                    {formData.dietary_restrictions === 'SPE' && (
                        <textarea
                            name="specific_dietary_restrictions"
                            value={formData.specific_dietary_restrictions}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Please specify your dietary restrictions"
                        />
                    )}
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Register
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default GuestRegistrationForm;