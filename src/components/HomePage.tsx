import { Link } from 'react-router-dom';
import { sharedStyles } from '../styles/shared';

const HomePage = () => {
    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-4xl text-center">
                    <h2 className={sharedStyles.heading}>Welcome to Our Wedding Celebration</h2>
                    <p className="mb-12 text-lg text-gray-700">We're thrilled to share our special day with you. Explore our wedding details below:</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <FloatingLink to="/rsvp" label="RSVP" delay="0" />
                        <FloatingLink to="/song-selection" label="Song Selection" delay="200" />
                        <FloatingLink to="/memories" label="Share Memories" delay="400" />
                        <FloatingLink to="/faq" label="FAQ" delay="600" />
                        <FloatingLink to="/accommodation" label="Accommodation" delay="800" />
                    </div>
                </div>
            </main>
        </div>
    );
};

interface FloatingLinkProps {
    to: string;
    label: string;
    delay: string;
}

const FloatingLink = ({ to, label, delay }: FloatingLinkProps) => {
    return (
        <Link
            to={to}
            className="relative p-4 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-opacity-30 group"
            style={{ animation: `float 3s ease-in-out infinite ${delay}ms` }}
        >
            <span className="text-lg font-medium text-purple-800 group-hover:text-purple-900">{label}</span>
            <div className="absolute inset-0 border-2 border-purple-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
    );
};

export default HomePage;