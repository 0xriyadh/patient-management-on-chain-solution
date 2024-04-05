import patientManagementContract from "../config/patientManagementContract";

export type User = {
    address: string;
    id: string;
    age: string;
    gender: string;
    vaccineStatus: string;
    district: string;
    symptomsDetails: string;
    isDead: string;
    role: string;
};

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
                const user: string[] = await patientManagementContract.methods
                    .getUser(address)
                    .call();
                return {
                    address: address,
                    id: user[0],
                    age: user[1],
                    gender: user[2],
                    vaccineStatus: user[3],
                    district: user[4],
                    symptomsDetails: user[5],
                    isDead: user[6],
                    role: user[7],
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
