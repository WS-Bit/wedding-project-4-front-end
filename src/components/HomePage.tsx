import { Link } from 'react-router-dom';
import { sharedStyles } from '../styles/shared';

const HomePage = () => {
    return (
        <div className={sharedStyles.pageContainer}>
            <div className={sharedStyles.contentContainer}>
                <h2 className={sharedStyles.heading}>Welcome to Our Wedding Website</h2>
                <p className="text-center mb-6 text-gray-600">We're excited to celebrate with you! Please use the links below to access different sections of our wedding planning:</p>
                <ul className="space-y-4">
                    <li>
                        <Link to="/rsvp" className={sharedStyles.button}>
                            RSVP
                        </Link>
                    </li>
                    <li>
                        <Link to="/song-selection" className={sharedStyles.button}>
                            Song Selection
                        </Link>
                    </li>
                    <li>
                        <Link to="/memories" className={sharedStyles.button}>
                            Share Memories
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HomePage;