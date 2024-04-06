import { useState, useEffect } from "react";
import { User } from "../types/userTypes";

export const useStatistics = (users: User[], totalDays: number) => {
    const [deathRate, setDeathRate] = useState(0);
    const [highestPatientDistrict, setHighestPatientDistrict] = useState("");

    useEffect(() => {
        if (users.length > 0) {
            // Calculate the death rate
            const deadUsers = users.filter((user) => user.isDead).length;
            const deathRate = deadUsers / totalDays;
            setDeathRate(deathRate);

            // Calculate the district with the highest number of patients
            const districtPatientCount: { [district: string]: number } = {};

            users.forEach((user) => {
                const district = user.district;
                if (districtPatientCount[district]) {
                    districtPatientCount[district]++;
                } else {
                    districtPatientCount[district] = 1;
                }
            });

            let maxDistrict = Object.keys(districtPatientCount)[0];
            let maxCount = districtPatientCount[maxDistrict];

            for (const district in districtPatientCount) {
                if (districtPatientCount[district] > maxCount) {
                    maxDistrict = district;
                    maxCount = districtPatientCount[district];
                }
            }

            setHighestPatientDistrict(maxDistrict);
        }
    }, [users, totalDays]);

    return { deathRate, highestPatientDistrict };
};
