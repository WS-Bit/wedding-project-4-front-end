export const DIETARY_CHOICES: { value: DietaryRestriction; label: string }[] = [
    { value: "N/A", label: "Not Applicable" },
    { value: "VEG", label: "Vegetarian" },
    { value: "VGN", label: "Vegan" },
    { value: "GF", label: "Gluten-Free" },
    { value: "NUT", label: "Nut Allergy" },
    { value: "LAC", label: "Lactose Intolerant" },
    { value: "SPE", label: "Special Diet (Please Specify)" },
];

export type DietaryRestriction = "N/A" | "VEG" | "VGN" | "GF" | "NUT" | "LAC" | "SPE" | "";

export interface GuestData {
    id?: number;
    name: string;
    email: string;
    phone: string;
    dietary_restrictions: DietaryRestriction | '';
    specific_dietary_restrictions?: string;
}

export interface RSVPData {
    guest: number;
    wedding_selection: 'ENG' | 'AUS' | 'BOTH';
    is_attending: boolean;
    additional_notes: string;
}

export interface MemoryFormData {
    guest_id: number;  // Changed from 'guest' to 'guest_id'
    memory_text: string;
}

export interface MemoryData extends Omit<MemoryFormData, 'guest_id'> {
    id: number;
    guest_name: string;
    date_shared: string;
    guest_id: number;  // Include guest_id here as well
}

export interface SongSelectionData {
    song_title: string;
    artist: string;
}

export interface RSVPResponse extends RSVPData {
    id: number;
}