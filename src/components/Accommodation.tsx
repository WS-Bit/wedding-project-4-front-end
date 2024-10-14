import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';

interface AccommodationOption {
    name: string;
    description: string;
    priceRange: string;
    contactInfo: string;
}

const accommodationOptions: AccommodationOption[] = [
    {
        name: "Luxury Hotel",
        description: "A 5-star hotel located near the venue, offering spacious rooms and excellent amenities.",
        priceRange: "£200 - £300 per night",
        contactInfo: "www.luxuryhotel.com | +44 123 456 7890"
    },
    {
        name: "Cozy Bed & Breakfast",
        description: "A charming B&B with a homely atmosphere, perfect for those seeking a more intimate setting.",
        priceRange: "£80 - £120 per night",
        contactInfo: "www.cozybnb.com | +44 098 765 4321"
    },
    {
        name: "Budget-Friendly Inn",
        description: "An affordable option with comfortable rooms and basic amenities.",
        priceRange: "£50 - £80 per night",
        contactInfo: "www.budgetinn.com | +44 111 222 3333"
    }
];

const Accommodation = () => {
    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Accommodation Options</h2>
                        <p className="text-center mb-8 text-gray-700">
                            We've curated a list of accommodation options near our venue to suit various preferences and budgets.
                        </p>
                        <div className="space-y-6">
                            {accommodationOptions.map((option, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
                                    <h3 className="text-xl font-semibold text-purple-800 mb-2">{option.name}</h3>
                                    <p className="text-gray-700 mb-2">{option.description}</p>
                                    <p className="text-purple-600 font-medium mb-2">{option.priceRange}</p>
                                    <p className="text-sm text-gray-600">{option.contactInfo}</p>
                                </div>
                            ))}
                        </div>
                    <BackButton className="mt-8" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Accommodation;