"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import {
    medianAgePerDistrictColumns,
    percentageOfPatientsPerAgeGroupColumns,
    regularStatColumns,
} from "./columns";
import usePastEvents from "@/app/hooks/usePastEvents";
import patientManagementContract from "../../config/patientManagementContract";
import { User } from "../../types/userTypes";
import { useStatistics } from "@/app/hooks/useStatistics";
import { getAllUsers } from "../../utils/users";
import { set } from "zod";
import { toast } from "sonner";

const StatTables = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userAdded, setUserAdded] = useState(false);
    const [userUpdated, setUserUpdated] = useState(false);

    const { totalDays } = usePastEvents(patientManagementContract);
    const {
        deathRate,
        highestPatientDistrict,
        medianAgeByDistrict,
        ageGroupPercentages,
    } = useStatistics(users, totalDays);

    // fetch users on page load
    useEffect(() => {
        async function fetchUsers() {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
        }

        fetchUsers();

        if (userAdded || userUpdated) {
            setUserAdded(false);
            setUserUpdated(false);
        }
    }, [userAdded, userUpdated]);

    useEffect(() => {
        const getFutureEvents = async () => {
            if (patientManagementContract) {
                try {
                    // Listen for NewPatientAdded events
                    (patientManagementContract.events.NewPatientAdded as any)({
                        filter: {}, // You can filter the events here
                    })
                        .on("data", (event: any) => {
                            console.log("New NewPatientAdded event", event);
                            setUserAdded(true);
                        })
                        .on("error", console.error);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        getFutureEvents();
    }, []);
    useEffect(() => {
        const getFutureEvents = async () => {
            if (patientManagementContract) {
                try {
                    // Listen for APatientIsUpdated events
                    (patientManagementContract.events.APatientIsUpdated as any)(
                        {
                            filter: {}, // You can filter the events here
                        }
                    )
                        .on("data", (event: any) => {
                            console.log("New APatientIsUpdated event", event);
                            setUserUpdated(true);
                        })
                        .on("error", console.error);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        getFutureEvents();
    }, []);

    return (
        <div className="space-y-10 my-10">
            <div>
                <h1 className="text-2xl text-center font-medium mb-3">
                    Death Rate & District with Highest Covid Patients
                </h1>
                <DataTable
                    columns={regularStatColumns}
                    data={[
                        {
                            death_rate: deathRate,
                            district: highestPatientDistrict,
                        },
                    ]}
                />
            </div>
            <div>
                <h1 className="text-2xl text-center font-medium mb-3">
                    Median Age By District
                </h1>
                <DataTable
                    columns={medianAgePerDistrictColumns}
                    data={Object.entries(medianAgeByDistrict).map(
                        ([district, age]) =>
                            ({ district, age } as {
                                district: string;
                                age: number;
                            })
                    )}
                />
            </div>
            <div>
                <h1 className="text-2xl text-center font-medium mb-3">
                    Percentage of Patients Per Age Group
                </h1>
                <DataTable
                    columns={percentageOfPatientsPerAgeGroupColumns}
                    data={Object.entries(ageGroupPercentages).map(
                        ([group, percentage]) =>
                            ({ group, percentage } as {
                                group: string;
                                percentage: number;
                            })
                    )}
                />
            </div>
        </div>
    );
};

export default StatTables;
