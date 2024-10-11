import React, { useState, useEffect } from 'react';
import { fetchGuests, submitMemory, fetchAllMemories } from '../services/api';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';
import MemoryConveyorBelt from './MemoryConveyorBelt';

interface Guest {
    id: number;
    name: string;
}

interface Memory {
    id: number;
    guest_name: string;
    memory_text: string;
    date_shared: string;
}

interface MemoryFormData {
    guest_id: number;
    memory_text: string;
}

const Memories = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [formData, setFormData] = useState<MemoryFormData>({
        guest_id: 0,
        memory_text: '',
    });
    const [memories, setMemories] = useState<Memory[]>([]);
    const [formError, setFormError] = useState<string>('');
    const [formSuccess, setFormSuccess] = useState<string>('');
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
        setFormError('');
        setFormSuccess('');

        if (!formData.guest_id) {
            setFormError('Please select a guest before submitting.');
            return;
        }

        try {
            const response = await submitMemory(formData);
            if (response.status === 201) {
                setFormSuccess('Memory shared successfully!');
                setFormData({ guest_id: 0, memory_text: '' });

                // Fetch updated memories
                const updatedMemoriesResponse = await fetchAllMemories();
                setMemories(updatedMemoriesResponse.data);
            }
        } catch (err: any) {
            console.error('Error sharing memory:', err);
            setFormError('Failed to share memory. Please try again.');
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.pageContainer}>Loading memories...</div>;
    }

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Memory Sharing</h2>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Shared Memories</h3>
                    <MemoryConveyorBelt memories={memories} />
                </div>

                <AnimatedForm onSubmit={handleSubmit} className={sharedStyles.form}>
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
                    {formError && <p className={sharedStyles.errorText}>{formError}</p>}
                    {formSuccess && <p className={sharedStyles.successText}>{formSuccess}</p>}
                    <BackButton className="mt-4" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Memories;