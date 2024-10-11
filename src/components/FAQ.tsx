import React, { useState } from 'react';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "When and where are the weddings?",
        answer: "We are having two celebrations: one in England and one in Australia. Specific dates and venues will be provided in your invitation."
    },
    {
        question: "What should I wear?",
        answer: "The dress code is semi-formal. Please avoid white as it's reserved for the bride."
    },
    {
        question: "Can I bring a plus one?",
        answer: "Please refer to your invitation for details on plus ones. If you have any questions, feel free to contact us directly."
    },
    {
        question: "Are children welcome?",
        answer: "We've decided to make our wedding an adult-only occasion. We hope you understand and can arrange for a sitter."
    },
    {
        question: "I messed up my registration form and forgot dietary restrictions, can I change that?",
        answer: "Just give us a message, we will get the database updated for you!"
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <h2 className={sharedStyles.heading}>Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="border border-purple-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full text-left p-4 focus:outline-none hover:bg-purple-50 transition-colors duration-200"
                                onClick={() => toggleQuestion(index)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-purple-800">{item.question}</span>
                                    <span className="text-purple-600">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </div>
                            </button>
                            {openIndex === index && (
                                <div className="p-4 bg-white">
                                    <p className="text-gray-700">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <BackButton className="mt-8" />
            </div>
        </div>
    );
};

export default FAQ;