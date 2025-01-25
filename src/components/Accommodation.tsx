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
            priceRange: "£130 - £180 per night",
            contactInfo: {
                website: "https://www.premierinn.com/gb/en/hotels/england/wiltshire/marlborough/marlborough.html",
                phone: "0330 128 1339"
            }
        },
        {
            name: "Golden Swan Pub Camping",
            description: "Campsite with pub and restaurant, which is also the venue of the reception.",
            priceRange: "£10 per person, per night",
            contactInfo: {
                website: "https://www.thegoldenswan.co.uk/campsite",
                phone: "01672 562289"
            }
        },
    ],
    australia: [
        {
            name: "Veriu Green Square",
            description: "In the area closest to the wedding venue and also 12 minutes from the airport.",
            priceRange: "A$200 - A$300 per night",
            contactInfo: {
                website: "https://hotels.app.link/MBxRnVWNrQb",
                phone: "+61 2 9160 2999"
            }
        },
        {
            name: "Meriton Suites Zetland",
            description: "Upmarket aparthotel in Zetland with indoor pool. 21 minutes from the airport.",
            priceRange: "A$230 - A$300 per night",
            contactInfo: {
                website: "https://hotels.app.link/upESw0eOrQb",
                phone: "+61 2 8074 9000"
            }
        },
    ]
};

type LocationTab = 'england' | 'australia';

const Accommodation = () => {
    const [activeTab, setActiveTab] = useState<LocationTab>('england');

    const TabButton = ({ location }: { location: LocationTab }) => (
        <button
            onClick={() => setActiveTab(location)}
            className={`
               px-6 py-3 
               text-sm font-medium 
               rounded-t-lg 
               transition-all duration-200
               relative
               ${activeTab === location
                    ? 'bg-white text-[#2c2c2c] border-t-2 border-r-2 border-l-2 border-[#bca7ab] shadow-sm -mb-px'
                    : 'bg-[#d8c7cb] text-[#2c2c2c] hover:bg-[#bca7ab] border border-transparent'
                }
               ${activeTab === location ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white' : ''}
           `}
        >
            <span className={`${activeTab === location ? 'font-bold' : ''}`}>
                {location.charAt(0).toUpperCase() + location.slice(1)}
            </span>
            {activeTab === location && (
                <div className="absolute -bottom-px left-0 right-0 h-1 bg-white" />
            )}
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
                            {activeTab === 'england' ? 'Wilcot, England' : 'Sydney, Australia'} Accommodations
                        </h3>

                        <p className="text-sm text-[#2c2c2c] mb-4">
                            {activeTab === 'england'
                                ? "Here are our recommended places to stay around Wilcot, all conveniently located near the wedding venue."
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
                                        <li>Pewsey Train Station is 5 minutes away from the village the celebration is being held in</li>
                                        <li>Taxi services are readily available</li>
                                        <li>We recommended booking early to avoid the stress!</li>
                                    </>
                                ) : (
                                    <>
                                        <li>All locations are accessible by public transport</li>
                                        <li>We recommended booking early to avoid the stress!</li>
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