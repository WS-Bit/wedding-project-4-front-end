import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface CustomPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
}

const CustomPhoneInput = ({ value, onChange }: CustomPhoneInputProps) => {
    return (
        <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="GB"
            value={value}
            onChange={(newValue) => onChange(newValue || '')}
            className="p-2 border rounded"
        />
    );
};

export default CustomPhoneInput;