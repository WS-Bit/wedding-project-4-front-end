import React, { useState, ChangeEvent } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import { getCountryCallingCode } from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';

const countries: Country[] = ['GB', 'US', 'AU', 'CA', 'DE', 'FR', 'JP', 'CN', 'IN', 'BR'];

const countryNames: { [key in Country]?: string } = {
    GB: 'United Kingdom',
    US: 'United States',
    AU: 'Australia',
    CA: 'Canada',
    DE: 'Germany',
    FR: 'France',
    JP: 'Japan',
    CN: 'China',
    IN: 'India',
    BR: 'Brazil',
};

interface CustomPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({ value, onChange }) => {
    const [country, setCountry] = useState<Country>('GB');

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCountry(e.target.value as Country);
    };

    return (
        <div className="flex flex-col space-y-2">
            <select
                className="p-2 border rounded"
                value={country}
                onChange={handleCountryChange}
            >
                {countries.map((c) => (
                    <option key={c} value={c}>
                        {countryNames[c]} (+{getCountryCallingCode(c)})
                    </option>
                ))}
            </select>
            <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry={country}
                value={value}
                onChange={(newValue) => onChange(newValue || '')}
                className="p-2 border rounded"
            />
        </div>
    );
};

export default CustomPhoneInput;