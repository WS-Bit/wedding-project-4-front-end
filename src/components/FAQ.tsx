import { useState } from 'react';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';

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
        answer: ""
    },
    {
        question: "Can I bring a plus one?",
        answer: "Please refer to your invitation for details on plus ones. If you have any questions, feel free to contact us directly."
    },
    {
        question: "Are children welcome?",
        answer: "We love your little ones, but we've decided to make our wedding an adult-only occasion. We hope you understand and can arrange for a sitter."
    },
    {
        question: "I think I may have put something wrong into the form/RSVP?",
        answer: "We can amend anything you have put into the website so just drop us a message."
    },
        {
        question: "What are you guys doing for gifts?",
        answer: "Your presence at our wedding is the greatest gift we could ask for. Should you with to honour us with a gift, a contribution to our future home together would be greatly appreciated adn we will have a way to gift on the day."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqData.map((item, index) => (
                                <div key={index} className="border border-purple-200 rounded-lg overflow-hidden">
                                    <button
                                        className="w-full text-left p-4 focus:outline-none hover:bg-purple-50 transition-colors duration-200"
                                        onClick={() => toggleQuestion(index)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-mauve-800">{item.question}</span>
                                            <span className="text-mauve-800">
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
                </AnimatedForm>
            </div>
        </div>
    );
};

export default FAQ;