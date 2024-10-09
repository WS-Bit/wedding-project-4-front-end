import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h2 className="text-3xl font-extrabold text-gray-900">Welcome to Our Wedding Website</h2>
                                <p>We're excited to celebrate with you! Please use the links below to access different sections of our wedding planning:</p>
                                <ul className="list-disc space-y-2 ml-4">
                                    <li>
                                        <Link to="/rsvp" className="text-cyan-600 hover:text-cyan-700 transition-colors duration-200">
                                            RSVP
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/song-selection" className="text-cyan-600 hover:text-cyan-700 transition-colors duration-200">
                                            Song Selection
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/memories" className="text-cyan-600 hover:text-cyan-700 transition-colors duration-200">
                                            Share Memories
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;