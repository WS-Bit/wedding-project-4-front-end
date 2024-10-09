import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordEntry = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                await axios.get('/api/csrf_cookie/', { withCredentials: true });
                console.log('CSRF token fetched successfully');
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
            }
        };
        fetchCsrfToken();
    }, []);

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const csrfToken = getCookie('csrftoken');
        console.log('CSRF Token:', csrfToken);

        try {
            console.log('Sending password to server...');
            const response = await axios.post('/api/enter_password/',
                { password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken || '',
                    },
                    withCredentials: true
                }
            );

            console.log('Server response:', response);

            if (response.data.is_authenticated) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/register');
            } else {
                setError('Incorrect password. Please try again.');
            }
        } catch (err) {
            console.error('Error during password submission:', err);
            if (axios.isAxiosError(err)) {
                console.error('Axios error details:', {
                    response: err.response,
                    request: err.request,
                    message: err.message
                });
                if (err.response) {
                    console.error('Full error response:', err.response);
                    setError(`Error: ${err.response.data.error || err.response.data.details || err.response.statusText || 'An unexpected error occurred'}`);
                } else if (err.request) {
                    setError('No response received from the server. Please try again.');
                } else {
                    setError(`Error: ${err.message}`);
                }
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