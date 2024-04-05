import patientManagementContract from "../config/patientManagementContract";
import { User } from "../types/userTypes";

export async function getAllUsers(): Promise<User[]> {
    try {
        const userAddresses = await patientManagementContract.methods
            .getUserAddresses()
            .call();

        if (!userAddresses || userAddresses.length === 0) {
            return [];
        }

        const users = await Promise.all(
            userAddresses.map(async (address: string) => {
                const user: (string | boolean | number)[] =
                    await patientManagementContract.methods
                        .getUser(address)
                        .call();
                return {
                    address: address,
                    id: Number(user[0]),
                    age: Number(user[1]),
                    gender: user[2] as "Male" | "Female",
                    vaccineStatus: user[3] as
                        | "NotVaccinated"
                        | "PartiallyVaccinated"
                        | "FullyVaccinated",
                    district: user[4] as string,
                    symptomsDetails: user[5] as string,
                    isDead: Boolean(user[6]),
                    role: user[7] as "Admin" | "Doctor" | "Patient",
                };
            })
        );

        console.log("Users fetched successfully:", users);
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}
