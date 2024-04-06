import { useState, useEffect } from "react";
import { User } from "../types/userTypes";

export const useStatistics = (users: User[], totalDays: number) => {
    const [deathRate, setDeathRate] = useState(0);
    const [highestPatientDistrict, setHighestPatientDistrict] = useState("");
    const [medianAgeByDistrict, setMedianAgeByDistrict] = useState<{
        [district: string]: number;
    }>({});

    const calculateDeathRate = () => {
        const deadUsers = users.filter((user) => user.isDead).length;
        const deathRate = deadUsers / totalDays;
        setDeathRate(deathRate);
    };

    const calculateHighestPatientDistrict = () => {
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
    };

    const calculateMedianAge = () => {
        const usersByDistrict: { [district: string]: User[] } = {};
        users.forEach((user) => {
            if (!usersByDistrict[user.district]) {
                usersByDistrict[user.district] = [];
            }
            usersByDistrict[user.district].push(user);
        });

        const medianAgeByDistrict: { [district: string]: number } = {};
        for (const district in usersByDistrict) {
            const ages = usersByDistrict[district].map((user) => user.age);
            ages.sort((a, b) => a - b);

            let medianAge;
            if (ages.length % 2 === 0) {
                medianAge =
                    (ages[ages.length / 2 - 1] + ages[ages.length / 2]) / 2;
            } else {
                medianAge = ages[(ages.length - 1) / 2];
            }

            medianAgeByDistrict[district] = medianAge;
        }

        setMedianAgeByDistrict(medianAgeByDistrict);
    };

    useEffect(() => {
        if (users.length > 0) {
            calculateDeathRate();
            calculateHighestPatientDistrict();
            calculateMedianAge();
        }
    }, [users, totalDays]);

    return { deathRate, highestPatientDistrict, medianAgeByDistrict };
};
