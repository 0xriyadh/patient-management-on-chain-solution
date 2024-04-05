export type User = {
    address: string;
    id: number;
    age: number;
    gender: "Male" | "Female"; // Assuming Gender is an enum with these values
    vaccineStatus: "NotVaccinated" | "PartiallyVaccinated" | "FullyVaccinated"; // Assuming VaccineStatus is an enum with these values
    district: string;
    symptomsDetails: string;
    isDead: boolean;
    role: "Admin" | "Doctor" | "Patient"; // Assuming Role is an enum with these values
};
