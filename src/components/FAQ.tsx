import { useState } from 'react';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';
import menImage from '../assets/men.jpeg';
import womenImage from '../assets/women.jpeg';
import colourImage from '../assets/colour.jpeg';

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
        answer: "Please refer to the Attire Palette & Inspo tab above for detailed guidance on wedding attire."
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
        answer: "Your presence at our wedding is the greatest gift we could ask for. Should you wish to honor us with a gift, a contribution to our future home together would be greatly appreciated and we have a way to gift on the website in the gift tab on the home screen."
    }
];

type TabType = 'faq' | 'attire';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('faq');

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`
                px-6 py-3 
                text-sm font-medium 
                rounded-t-lg 
                transition-all duration-200
                relative
                ${activeTab === tab
                    ? 'bg-white text-[#2c2c2c] border-t-2 border-r-2 border-l-2 border-[#bca7ab] shadow-sm -mb-px'
                    : 'bg-[#d8c7cb] text-[#2c2c2c] hover:bg-[#bca7ab] border border-transparent'
                }
                ${activeTab === tab ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white' : ''}
            `}
        >
            <span className={`${activeTab === tab ? 'font-bold' : ''}`}>
                {label}
            </span>
            {activeTab === tab && (
                <div className="absolute -bottom-px left-0 right-0 h-1 bg-white" />
            )}
        </button>
    );

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={`${sharedStyles.wideContentContainer} max-h-screen overflow-y-auto`}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Wedding Information</h2>

                    <div className="flex space-x-2 mb-4">
                        <TabButton tab="faq" label="FAQ" />
                        <TabButton tab="attire" label="Attire Palette & Inspo" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-[#bca7ab]">
                        {activeTab === 'faq' ? (
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
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <img
                                            src={menImage}
                                            alt="Men's Wedding Attire"
                                            className="w-full h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src={womenImage}
                                            alt="Women's Wedding Attire"
                                            className="w-full h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src={colourImage}
                                        alt="Wedding Color Palette"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <BackButton className="mt-8" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default FAQ;