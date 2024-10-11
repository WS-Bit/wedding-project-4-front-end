import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedFormProps {
    children: React.ReactNode;
    className?: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AnimatedForm = ({ children, className = '', onSubmit }: AnimatedFormProps) => {
    const formVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.form
            className={className}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.form>
    );
};

export default AnimatedForm;