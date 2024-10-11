import { useNavigate } from 'react-router-dom';
import { sharedStyles } from '../styles/shared';

interface BackButtonProps {
    className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };

    return (
        <button
            onClick={handleClick}
            className={`${sharedStyles.button} ${className}`}
        >
            Back to Home
        </button>
    );
};

export default BackButton;