import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Memory {
    id: number;
    guest_name: string;
    memory_text: string;
    date_shared: string;
}

interface MemoryConveyorBeltProps {
    memories: Memory[];
}

const MemoryConveyorBelt = ({ memories }: MemoryConveyorBeltProps): JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % memories.length);
        }, 5000); // Change memory every 5 seconds

        return () => clearInterval(timer);
    }, [memories.length]);

    const goToNext = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        setCurrentIndex((prevIndex) => (prevIndex + 1) % memories.length);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        setCurrentIndex((prevIndex) => (prevIndex - 1 + memories.length) % memories.length);
    };

    if (memories.length === 0) {
        return <div className="text-center text-gray-600">No memories shared yet.</div>;
    }

    return (
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg shadow-lg">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0 flex items-center justify-center p-6 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <p className="text-lg font-semibold text-purple-800">{memories[currentIndex].guest_name}</p>
                        <p className="mt-2 text-gray-700">{memories[currentIndex].memory_text}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Shared on: {new Date(memories[currentIndex].date_shared).toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4">
                <button
                    onClick={goToPrevious}
                    className="px-3 py-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={goToNext}
                    className="px-3 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MemoryConveyorBelt;