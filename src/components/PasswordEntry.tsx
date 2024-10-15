import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPassword } from '../services/api';
import { sharedStyles } from '../styles/shared';

const PasswordEntry = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const isAuthenticated = await checkPassword(password);
            if (isAuthenticated) {
                navigate('/register');
            } else {
                setError('Incorrect password. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${sharedStyles.pageContainer} ${sharedStyles.gradientBg}`}>
            <div className={sharedStyles.contentContainer}>
                <h2 className={sharedStyles.heading}>Welcome to Our Wedding</h2>
                <p className="text-center mb-6 text-gray-600">Please enter the password to access our special day details.</p>
                <form onSubmit={handleSubmit} className={sharedStyles.form}>
                    <div>
                        <label htmlFor="password" className={sharedStyles.label}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={sharedStyles.input}
                            placeholder="Enter password"
                            required
                            aria-describedby="password-error"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={sharedStyles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Checking...' : 'Enter'}
                    </button>
                </form>
                {error && (
                    <p id="password-error" className={sharedStyles.errorText} role="alert">
                        {error}
                    </p>
                )}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">We can't wait to celebrate with you!</p>
                </div>
            </div>
        </div>
    );
};

export default PasswordEntry;