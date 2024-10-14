import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPassword, fetchCsrfToken } from '../services/api';
import { sharedStyles } from '../styles/shared';

const PasswordEntry = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [csrfFetched, setCsrfFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeCsrf = async () => {
            try {
                setIsLoading(true);
                await fetchCsrfToken();
                setCsrfFetched(true);
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
                setError('Failed to initialize security token. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };
        initializeCsrf();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!csrfFetched) {
            setError('Please wait for the page to finish loading before submitting.');
            return;
        }

        setError('');
        setIsLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await checkPassword(password);

            if (response.data.is_authenticated) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/register');
            } else {
                setError('Incorrect password. Please try again.');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
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
                            disabled={isLoading || !csrfFetched}
                        />
                    </div>
                    <button
                        type="submit"
                        className={sharedStyles.button}
                        disabled={isLoading || !csrfFetched}
                    >
                        {isLoading ? 'Unlocking...' : csrfFetched ? 'Enter' : 'Loading...'}
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