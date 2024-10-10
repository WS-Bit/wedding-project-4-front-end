export type DietaryRestriction = "N/A" | "VEG" | "VGN" | "GF" | "NUT" | "LAC" | "SPE" | "";

export interface GuestData {
    name: string;
    email: string;
    phone: string;
    dietary_restrictions: DietaryRestriction;
    specific_dietary_restrictions: string;
}

export const DIETARY_CHOICES: { value: DietaryRestriction; label: string }[] = [
    { value: "N/A", label: "Not Applicable" },
    { value: "VEG", label: "Vegetarian" },
    { value: "VGN", label: "Vegan" },
    { value: "GF", label: "Gluten-Free" },
    { value: "NUT", label: "Nut Allergy" },
    { value: "LAC", label: "Lactose Intolerant" },
    { value: "SPE", label: "Special Diet (Please Specify)" },
];