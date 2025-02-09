import { Link } from 'react-router-dom';
import { sharedStyles, getThemeStyles } from '../styles/shared';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    return (
        <div className={`${sharedStyles.pageContainer} ${getBackgroundClass(theme)}`}>
            <main className={`flex-grow flex flex-col items-center justify-center p-4 ${themeStyles.text}`}>
                <div className="w-full max-w-4xl text-center">
                    <h2 className={`${sharedStyles.heading} ${themeStyles.heading}`}>Welcome to Our Wedding Celebration</h2>
                    <p className="mb-12 text-lg">We're thrilled to share our special day with you. Explore our wedding details below:</p>
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <FloatingLink to="/rsvp" label="RSVP" delay="0" />
                        <FloatingLink to="/song-selection" label="Song Suggestion" delay="200" />
                        <FloatingLink to="/memories" label="Share Memories" delay="400" />
                        <FloatingLink to="/faq" label="FAQ" delay="600" />
                        <FloatingLink to="/accommodation" label="Accommodation" delay="800" />
                        <FloatingLink to="/gifts" label="Gift Registry" delay="1000" />
                        <FloatingLink to="/attire" label="Attire Guide" delay="1200" />
                    </div>
                    {/* <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setTheme('default')}
                            className={`${themeStyles.button} ${theme === 'default' ? 'ring-2 ring-white' : ''}`}
                        >
                            Default Theme
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`${themeStyles.button} ${theme === 'dark' ? 'ring-2 ring-white' : ''}`}
                        >
                            Dark Theme
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={`${themeStyles.button} ${theme === 'light' ? 'ring-2 ring-white' : ''}`}
                        >
                            Light Theme
                        </button>
                    </div> */}
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
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    return (
        <Link
            to={to}
            className={`relative p-4 ${themeStyles.bg} bg-opacity-20 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-opacity-30 group`}
            style={{ animation: `float 3s ease-in-out infinite ${delay}ms` }}
        >
            <span className={`text-lg font-medium ${themeStyles.text} group-hover:text-opacity-80`}>{label}</span>
            <div className="absolute inset-0 border-2 border-white-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
    );
};

const getBackgroundClass = (theme: string) => {
    switch (theme) {
        case 'dark':
            return 'bg-gray-900';
        case 'light':
            return 'bg-gray-100';
        default:
            return sharedStyles.gradientBg;
    }
};

export default HomePage;