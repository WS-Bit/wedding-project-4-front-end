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
        }, 5000);

        return () => clearInterval(timer);
    }, [memories.length]);

    const goToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % memories.length);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + memories.length) % memories.length);
    };

    if (memories.length === 0) {
        return <div className="text-center text-gray-600">No memories shared yet.</div>;
    }

    return (
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-r from-mauve-100 to-mauve-200 rounded-lg shadow-lg">
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
                        <p className="text-lg font-semibold text-mauve-800">{memories[currentIndex].guest_name}</p>
                        <p className="mt-2 text-mauve-700">{memories[currentIndex].memory_text}</p>
                        <p className="mt-2 text-sm text-mauve-500">
                            Shared on: {new Date(memories[currentIndex].date_shared).toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4">
                <button
                    onClick={goToPrevious}
                    className="px-4 py-2 bg-mauve-800 text-black rounded-full 
                             hover:bg-mauve-900 active:bg-mauve-950
                             focus:outline-none focus:ring-2 focus:ring-mauve-600 
                             focus:ring-opacity-50 transition-colors duration-200
                             text-sm font-medium shadow-sm"
                >
                    Previous
                </button>
                <button
                    onClick={goToNext}
                    className="px-4 py-2 bg-mauve-800 text-black rounded-full 
                             hover:bg-mauve-900 active:bg-mauve-950
                             focus:outline-none focus:ring-2 focus:ring-mauve-600 
                             focus:ring-opacity-50 transition-colors duration-200
                             text-sm font-medium shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MemoryConveyorBelt;