import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPassword, fetchCsrfToken } from '../services/api';

const PasswordEntry = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const initializeCsrf = async () => {
            try {
                await fetchCsrfToken();
                console.log('CSRF token fetched successfully');
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
            }
        };
        initializeCsrf();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Sending password to server...');
            const response = await checkPassword(password);

            console.log('Server response:', response);

            if (response.data.is_authenticated) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/register');
            } else {
                setError('Incorrect password. Please try again.');
            }
        } catch (err) {
            console.error('Error during password submission:', err);
            if (err instanceof Error) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="Enter password"
                        required
                    />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Submit
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default PasswordEntry;