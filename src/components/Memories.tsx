import React, { useState, useEffect } from 'react';
import { fetchGuests, submitMemory, fetchAllMemories } from '../services/api';
import axios from 'axios';

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

const Memories = () => {
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
        const loadGuests = async () => {
            try {
                const response = await fetchGuests();
                setGuests(response.data);
            } catch (err) {
                console.error('Failed to fetch guests', err);
                setError('Failed to load guest list. Please try again later.');
            }
        };

        const loadMemories = async () => {
            try {
                const response = await fetchAllMemories();
                console.log(response.data);  // Log the response to inspect its structure
                setMemories(response.data);
            } catch (err) {
                console.error('Failed to fetch memories', err);
                setError('Failed to load memories. Please try again later.');
            }
        };
        loadGuests();
        loadMemories();
        setIsLoading(false);
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
            const response = await submitMemory(formData);
            if (response.status === 201) {
                setSuccess('Memory shared successfully!');
                setFormData({ guest_id: formData.guest_id, memory_text: '' });
                // Reload memories after successful submission
                const updatedMemories = await fetchAllMemories();
                setMemories(updatedMemories.data);
            }
        } catch (err: unknown) {
            console.error('Error sharing memory:', err);

            // Type guard to check if the error is an AxiosError
            if (axios.isAxiosError(err)) {
                console.error('Axios response data:', err.response?.data);
                setError(`Failed to share memory. Server responded with: ${err.response?.data?.detail || err.message}`);
            } else if (err instanceof Error) {
                // Handle other general errors
                setError(`Failed to share memory. Error: ${err.message}`);
            } else {
                // Handle unknown errors
                setError('Failed to share memory due to an unknown error.');
            }
        }
    };


    if (isLoading) {
        return <div>Loading guests...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Share a Memory</h2>
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
                {formData.guest_id && (
                    <>
                        <div>
                            <label htmlFor="memory_text" className="block text-sm font-medium text-gray-700">
                                Your Memory
                            </label>
                            <textarea
                                id="memory_text"
                                name="memory_text"
                                value={formData.memory_text}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                rows={4}
                                maxLength={100}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Share Memory
                        </button>
                    </>
                )}
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}

            {/* Display the list of shared memories */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Shared Memories</h3>
                {memories.length > 0 ? (
                    <ul className="space-y-4">
                        {memories.map((memory) => (
                            <div key={memory.id} className="memory-item">
                                <h4 className="text-lg font-semibold">
                                    {/* Ensure guest_name is being accessed correctly */}
                                    {memory.guest_name ? memory.guest_name : "Unknown Guest"}
                                </h4>
                                <p>{memory.memory_text}</p>
                                <p>Shared on: {memory.date_shared}</p>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No memories shared yet.</p>
                )}
            </div>
        </div>
    );
};

export default Memories;
