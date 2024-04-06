import { useState, useEffect } from "react";
import { User } from "../types/userTypes";

export const useStatistics = (users: User[], totalDays: number) => {
    const [deathRate, setDeathRate] = useState(0);
    const [highestPatientDistrict, setHighestPatientDistrict] = useState("");
    const [medianAgeByDistrict, setMedianAgeByDistrict] = useState<{
        [district: string]: number;
    }>({});
    const [ageGroupPercentages, setAgeGroupPercentages] = useState<{
        [ageGroup: string]: number;
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

    const calculateAgeGroupPercentages = () => {
        const ageGroups: { [ageGroup: string]: number } = {
            Children: 0,
            Teenagers: 0,
            Young: 0,
            Elder: 0,
        };

        users.forEach((user) => {
            if (user.age < 13) {
                ageGroups["Children"]++;
            } else if (user.age < 20) {
                ageGroups["Teenagers"]++;
            } else if (user.age < 50) {
                ageGroups["Young"]++;
            } else {
                ageGroups["Elder"]++;
            }
        });

        for (const ageGroup in ageGroups) {
            ageGroups[ageGroup as keyof typeof ageGroups] = Number(
                (
                    (ageGroups[ageGroup as keyof typeof ageGroups] /
                        users.length) *
                    100
                ).toFixed(2)
            );
        }

        setAgeGroupPercentages(ageGroups);
    };

    useEffect(() => {
        if (users.length > 0) {
            calculateDeathRate();
            calculateHighestPatientDistrict();
            calculateMedianAge();
            calculateAgeGroupPercentages();
        }
    }, [users, totalDays]);

    return {
        deathRate,
        highestPatientDistrict,
        medianAgeByDistrict,
        ageGroupPercentages,
    };
};
