import { sharedStyles } from '../styles/shared';
import AnimatedForm from './AnimatedForm';
import BackButton from './BackButton';
import menImage from '../assets/men.jpeg';
import womenImage from '../assets/women.jpeg';
import colourImage from '../assets/colour.jpeg';

const Attire = () => {
    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={`${sharedStyles.wideContentContainer} max-h-screen overflow-y-auto`}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Wedding Attire Guide</h2>
                    <div className="bg-white p-4 rounded-lg border border-[#bca7ab]">
                        <div className="space-y-6">
                            <div className="mb-6">
                                <p className="text-[#2c2c2c] font-medium">
                                    Black-tie-optional attire.<br /><br />
                                    We kindly ask that you wear a tuxedo or dark suit and tie.<br /><br />
                                    An evening gown or a midi or knee-length cocktail dress would be appropriate.<br />
                                    Think shiny fabrics that shimmer for dresses, and Gold accents and accessories to shine like the stars.
                                    Please refer to the colour palette for the colours we would love our guests to be inspired by.
                                </p>
                            </div>
                            <div className="mb-6">
                                <img
                                    src={colourImage}
                                    alt="Wedding Color Palette"
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={womenImage}
                                        alt="Women's Wedding Attire"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                                <div>
                                    <img
                                        src={menImage}
                                        alt="Men's Wedding Attire"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <BackButton className="mt-8" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Attire;