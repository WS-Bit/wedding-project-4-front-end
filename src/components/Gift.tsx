import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';
import giftQR from '../assets/giftqr.png';

interface GiftProps { }

const Gift = ({ }: GiftProps) => {
    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Gift Registry</h2>
                    <div className="flex flex-col items-center space-y-6">
                        <a
                            href="https://www.hitchd.com/nicoleandwill2025"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2c2c2c] underline hover:text-[#bca7ab] transition-colors duration-200"
                        >
                            Website
                        </a>
                        <img
                            src={giftQR}
                            alt="Gift Registry QR Code"
                            className="w-48 h-48 object-contain"
                        />
                    </div>
                    <BackButton className="mt-8" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Gift;