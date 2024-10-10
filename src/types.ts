// src/types.ts

export const DIETARY_CHOICES = [
    { value: 'N/A', label: 'Not Applicable' },
    { value: 'VEG', label: 'Vegetarian' },
    { value: 'VGN', label: 'Vegan' },
    { value: 'GF', label: 'Gluten-Free' },
    { value: 'NUT', label: 'Nut-Free' },
    { value: 'LAC', label: 'Lactose-Free' },
    { value: 'SPE', label: 'Specific' },
] as const;

export type DietaryChoice = typeof DIETARY_CHOICES[number]['value'];

export interface GuestData {
    name: string;
    email: string;
    phone: string;
    dietary_restrictions: DietaryChoice;
    specific_dietary_restrictions: string;
}