import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface CustomPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const CustomPhoneInput = ({ value, onChange, placeholder }: CustomPhoneInputProps) => {
    return (
        <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="GB"
            value={value}
            onChange={(newValue) => onChange(newValue || '')}
            placeholder={placeholder}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition"
        />
    );
};

export default CustomPhoneInput;