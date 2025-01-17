import { useState } from 'react';
import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';

interface AccommodationOption {
    name: string;
    description: string;
    priceRange: string;
    contactInfo: {
        website: string;
        phone: string;
    };
}

interface AccommodationData {
    england: AccommodationOption[];
    australia: AccommodationOption[];
}

const accommodationData: AccommodationData = {
    england: [
        {
            name: "Premier Inn - Marlborough",
            description: "Standard hotel with modern amenities, 15 minutes from venue.",
            priceRange: "£180 - £250 per night",
            contactInfo: {
                website: "https://www.premierinn.com/gb/en/hotels/england/wiltshire/marlborough/marlborough.html",
                phone: "0330 128 1339"
            }
        },
        {
            name: "York Lodge B&B",
            description: "Charming bed & breakfast in a historic building, 15 minutes from venue.",
            priceRange: "£90 - £120 per night",
            contactInfo: {
                website: "www.yorklodge.com",
                phone: "+44 098 765 4321"
            }
        },
        {
            name: "The Railway Inn",
            description: "Comfortable pub accommodation with character, 5 minutes from venue.",
            priceRange: "£70 - £90 per night",
            contactInfo: {
                website: "www.railwayinn.com",
                phone: "+44 111 222 3333"
            }
        }
    ],
    australia: [
        {
            name: "Beachfront Resort",
            description: "Modern resort with ocean views, 5 minutes from the wedding venue.",
            priceRange: "A$250 - A$350 per night",
            contactInfo: {
                website: "www.beachfrontresort.com.au",
                phone: "+61 2 1234 5678"
            }
        },
        {
            name: "The Coastal Inn",
            description: "Boutique hotel with beach access and excellent amenities.",
            priceRange: "A$180 - A$220 per night",
            contactInfo: {
                website: "www.coastalinn.com.au",
                phone: "+61 2 8765 4321"
            }
        },
        {
            name: "Seaside Apartments",
            description: "Self-contained apartments perfect for longer stays.",
            priceRange: "A$150 - A$200 per night",
            contactInfo: {
                website: "www.seasideapts.com.au",
                phone: "+61 2 9999 8888"
            }
        }
    ]
};

type LocationTab = 'england' | 'australia';

const Accommodation = () => {
    const [activeTab, setActiveTab] = useState<LocationTab>('england');

    const TabButton = ({ location }: { location: LocationTab }) => (
        <button
            onClick={() => setActiveTab(location)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeTab === location
                    ? 'bg-white text-[#2c2c2c] border-t border-r border-l border-[#bca7ab]'
                : 'bg-[#d8c7cb] text-[#2c2c2c] hover:bg-[#bca7ab] hover:text-white'
                }`}
        >
            {location.charAt(0).toUpperCase() + location.slice(1)}
        </button>
    );

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={`${sharedStyles.wideContentContainer} max-h-screen overflow-y-auto`}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Accommodation Options</h2>

                    <div className="flex space-x-2 mb-4">
                        <TabButton location="england" />
                        <TabButton location="australia" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-[#bca7ab]">
                        <h3 className="text-lg font-semibold text-[#2c2c2c] mb-3">
                            {activeTab === 'england' ? 'York, England' : 'Sydney, Australia'} Accommodations
                        </h3>

                        <p className="text-sm text-[#2c2c2c] mb-4">
                            {activeTab === 'england'
                                ? "Here are our recommended places to stay in York, all conveniently located near the wedding venue."
                                : "Discover our selected accommodation options in Sydney, all within easy reach of the wedding location."
                            }
                        </p>

                        <div className="space-y-4">
                            {accommodationData[activeTab].map((option, index) => (
                                <div key={index} className="bg-[#d8c7cb] bg-opacity-20 p-4 rounded-lg shadow-sm border border-[#bca7ab]">
                                    <h4 className="text-lg font-semibold text-[#2c2c2c] mb-1">{option.name}</h4>
                                    <p className="text-sm text-[#2c2c2c] mb-1">{option.description}</p>
                                    <p className="text-sm text-[#2c2c2c] font-medium mb-1">{option.priceRange}</p>
                                    <div className="text-xs text-[#2c2c2c]">
                                        <a
                                            href={option.contactInfo.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#2c2c2c] underline transition-colors duration-200"
                                        >
                                            Website
                                        </a>
                                        <span className="mx-2">|</span>
                                        <span>{option.contactInfo.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-sm text-[#2c2c2c]">
                            <p className="font-medium">Additional Information:</p>
                            <ul className="list-disc list-inside mt-2">
                                {activeTab === 'england' ? (
                                    <>
                                        <li>York Train Station is central to all accommodations</li>
                                        <li>Taxi services are readily available in the city</li>
                                        <li>We recommend booking early as York is a popular destination</li>
                                    </>
                                ) : (
                                    <>
                                        <li>All locations are accessible by public transport</li>
                                        <li>Airport transfers can be arranged</li>
                                        <li>Early booking is recommended during peak season</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <BackButton className="mt-6" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Accommodation;