import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GuestData } from '../types';
import { sharedStyles } from '../styles/shared';

interface SearchableGuestDropdownProps {
    guests: GuestData[];
    selectedGuestId: number | '';
    onGuestSelect: (guestId: number) => void;
    label: string;
}

const SearchableGuestDropdown = ({
    guests,
    selectedGuestId,
    onGuestSelect,
    label
}: SearchableGuestDropdownProps): JSX.Element => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredGuests, setFilteredGuests] = useState(guests);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        const filtered = guests.filter(guest =>
            guest.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGuests(filtered);
        setIsDropdownOpen(searchTerm.length > 0);
    }, [searchTerm, guests]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isDropdownOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (selectedGuestId) {
            onGuestSelect(0); // Reset selection when typing
        }
    };

    const handleGuestClick = (guest: GuestData) => {
        onGuestSelect(guest.id!);
        setSearchTerm(guest.name);
        setIsDropdownOpen(false);
    };

    const dropdownContent = (
        <div
            style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxHeight: '240px',
                overflowY: 'auto',
                zIndex: 9999
            }}
        >
            {filteredGuests.map((guest) => (
                <div
                    key={guest.id}
                    style={{
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: 'white'
                    }}
                    onClick={() => handleGuestClick(guest)}
                >
                    {guest.name}
                </div>
            ))}
            {filteredGuests.length === 0 && (
                <div style={{ padding: '0.5rem 1rem', color: '#6b7280', backgroundColor: 'white' }}>
                    No matching guests found
                </div>
            )}
        </div>
    );

    return (
        <div className="mb-4 relative">
            <label htmlFor="guest-search" className={sharedStyles.label}>
                {label}
            </label>
            <input
                ref={inputRef}
                type="text"
                id="guest-search"
                placeholder="Type to search for your name"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                className={`${sharedStyles.input} ${selectedGuestId ? 'border-green-500' : ''}`}
            />
            {isDropdownOpen && ReactDOM.createPortal(dropdownContent, document.body)}
        </div>
    );
};

export default SearchableGuestDropdown;