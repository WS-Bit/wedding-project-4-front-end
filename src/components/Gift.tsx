import { sharedStyles } from '../styles/shared';
import BackButton from './BackButton';
import AnimatedForm from './AnimatedForm';

interface GiftProps { }

const Gift = ({ }: GiftProps) => {
    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.wideContentContainer}>
                <AnimatedForm onSubmit={(e) => e.preventDefault()}>
                    <h2 className={sharedStyles.heading}>Gift Registry</h2>
                    <p className="text-[#2c2c2c] text-center mb-6">
                        Welcome to our gift registry page. Your presence at our wedding is the greatest gift of all.
                    </p>
                    <BackButton className="mt-4" />
                </AnimatedForm>
            </div>
        </div>
    );
};

export default Gift;