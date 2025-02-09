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
        question: "Can I bring a plus one?",
        answer: "Please refer to your invitation for details on plus ones. If you have any questions, feel free to contact us directly."
    },
    {
        question: "What should I wear?",
        answer: "Please refer to the Attire page on the home screen."
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
        answer: "Your presence at our wedding is the greatest gift we could ask for. Should you wish to honor us with a gift, a contribution to our future home together would be greatly appreciated. There is a link to our gift registry on the home screen."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={`${sharedStyles.wideContentContainer} max-h-screen overflow-y-auto`}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Frequently Asked Questions</h2>

                    <div className="bg-white p-4 rounded-lg border border-[#bca7ab]">
                        <div className="space-y-4">
                            {faqData.map((item, index) => (
                                <div key={index} className="border border-[#bca7ab] rounded-lg overflow-hidden">
                                    <button
                                        className="w-full text-left p-4 focus:outline-none hover:bg-[#d8c7cb] hover:bg-opacity-20 transition-colors duration-200"
                                        onClick={() => toggleQuestion(index)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-[#2c2c2c]">{item.question}</span>
                                            <span className="text-[#2c2c2c]">
                                                {openIndex === index ? '−' : '+'}
                                            </span>
                                        </div>
                                    </button>
                                    {openIndex === index && (
                                        <div className="p-4 bg-white border-t border-[#bca7ab]">
                                            <p className="text-[#2c2c2c]">{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <BackButton className="mt-8" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default FAQ;