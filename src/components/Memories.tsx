import React, { useState, useEffect } from 'react';
import { fetchGuests, submitMemory, fetchAllMemories } from '../services/api';
import { sharedStyles } from '../styles/shared';
import axios, { AxiosError } from 'axios';

interface Guest {
    id: number;
    name: string;
}

interface Memory {
    id: number;
    guest: Guest;
    guest_name: string;
    memory_text: string;
    date_shared: string;
}

interface MemoryData {
    guest_id: number | null;
    memory_text: string;
}

interface ErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

const Memories: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [formData, setFormData] = useState<MemoryData>({
        guest_id: null,
        memory_text: '',
    });
    const [memories, setMemories] = useState<Memory[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [guestsResponse, memoriesResponse] = await Promise.all([
                    fetchGuests(),
                    fetchAllMemories()
                ]);
                setGuests(guestsResponse.data);
                setMemories(memoriesResponse.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            console.log('Submitting memory:', formData);
            const response = await submitMemory(formData);
            console.log('Server response:', response);
            if (response.status === 201) {
                setSuccess('Memory shared successfully!');
                setFormData({ guest_id: formData.guest_id, memory_text: '' });

                // Fetch and update memories immediately
                const updatedMemoriesResponse = await fetchAllMemories();
                setMemories(updatedMemoriesResponse.data);
            }
        } catch (err: unknown) {
            console.error('Error sharing memory:', err);

            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>;
                if (axiosError.response) {
                    console.error('Response data:', axiosError.response.data);
                    console.error('Response status:', axiosError.response.status);
                    console.error('Response headers:', axiosError.response.headers);

                    const errorDetail = axiosError.response.data?.detail || 'An unknown error occurred';
                    setError(`Failed to share memory. Server responded with: ${errorDetail}`);
                } else {
                    setError(`Failed to share memory. ${axiosError.message}`);
                }
            } else if (err instanceof Error) {
                setError(`Failed to share memory. Error: ${err.message}`);
            } else {
                setError('Failed to share memory due to an unknown error.');
            }
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading memories...</div>;
    }

    return (
        <div className={sharedStyles.pageContainer}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Share a Memory</h2>
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
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
                    {formData.guest_id && (
                        <>
                            <div>
                                <label htmlFor="memory_text" className={sharedStyles.label}>
                                    Your Memory
                                </label>
                                <textarea
                                    id="memory_text"
                                    name="memory_text"
                                    value={formData.memory_text}
                                    onChange={handleChange}
                                    required
                                    className={sharedStyles.input}
                                    rows={4}
                                    maxLength={100}
                                />
                            </div>
                            <button type="submit" className={sharedStyles.button}>
                                Share Memory
                            </button>
                        </>
                    )}
                </form>
                {error && <p className={sharedStyles.errorText}>{error}</p>}
                {success && <p className={sharedStyles.successText}>{success}</p>}

                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Shared Memories</h3>
                    {memories.length > 0 ? (
                        <ul className="space-y-4">
                            {memories.map((memory) => (
                                <li key={memory.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-700">
                                        {memory.guest_name ? memory.guest_name : "Unknown Guest"}
                                    </h4>
                                    <p className="text-gray-600">{memory.memory_text}</p>
                                    <p className="text-sm text-gray-500 mt-2">Shared on: {new Date(memory.date_shared).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No memories shared yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Memories;