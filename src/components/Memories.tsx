import React, { useState, useEffect } from 'react';
import { fetchGuests, submitMemory, fetchAllMemories } from '../services/api';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';
import MemoryConveyorBelt from './MemoryConveyorBelt';
import { GuestData, MemoryData, MemoryFormData } from '../types';

const Memories = () => {
    const [guests, setGuests] = useState<GuestData[]>([]);
    const [formData, setFormData] = useState<MemoryFormData>({
        guest_id: 0,  // Changed from 'guest' to 'guest_id'
        memory_text: '',
    });
    const [memories, setMemories] = useState<MemoryData[]>([]);
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
        setFormData(prev => ({ ...prev, [name]: name === 'guest_id' ? Number(value) : value }));
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
                setFormData({ guest_id: 0, memory_text: '' });

                // Fetch updated memories
                const updatedMemoriesResponse = await fetchAllMemories();
                setMemories(updatedMemoriesResponse.data);
            }
        } catch (err: any) {
            console.error('Error sharing memory:', err);
            setError(`Failed to share memory: ${err.response?.data?.detail || err.message || 'Unknown error'}`);
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading memories...</div>;
    }

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <AnimatedForm onSubmit={handleSubmit} className={sharedStyles.form}>
                    <h2 className={sharedStyles.heading}>Memory Sharing</h2>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Shared Memories</h3>
                        <MemoryConveyorBelt memories={memories} />
                    </div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Share Your Memory</h3>
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
                    {error && <p className={sharedStyles.errorText}>{error}</p>}
                    {success && <p className={sharedStyles.successText}>{success}</p>}
                    <BackButton className="mt-4" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Memories;