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

    // Update filtered guests when search term changes
    useEffect(() => {
        const filtered = guests.filter(guest =>
            guest.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGuests(filtered);
        // Only show dropdown if there are filtered results and we're not showing an exact match
        const exactMatch = guests.some(guest =>
            guest.name.toLowerCase() === searchTerm.toLowerCase()
        );
        setIsDropdownOpen(searchTerm.length > 0 && !exactMatch);
    }, [searchTerm, guests]);

    // Update input value when selectedGuestId changes
    useEffect(() => {
        if (selectedGuestId) {
            const selectedGuest = guests.find(guest => guest.id === selectedGuestId);
            if (selectedGuest) {
                setSearchTerm(selectedGuest.name);
            }
        }
    }, [selectedGuestId, guests]);

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
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(true);
        if (selectedGuestId) {
            onGuestSelect(0); // Reset selection when typing
        }
    };

    const handleGuestClick = (guest: GuestData) => {
        if (!guest.id) return;

        onGuestSelect(guest.id);
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
                <button
                    key={guest.id}
                    type="button"
                    className={`
                        w-full text-left px-4 py-2 hover:bg-purple-50 
                        transition-colors duration-150 border-b border-gray-100
                        ${guest.id === selectedGuestId ? 'bg-purple-50' : 'bg-white'}
                    `}
                    onClick={() => handleGuestClick(guest)}
                >
                    {guest.name}
                </button>
            ))}
            {filteredGuests.length === 0 && (
                <div className="px-4 py-2 text-gray-500">
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