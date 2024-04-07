import React from "react";
import { DataTable } from "./data-table";
import { medianAgePerDistrictColumns, percentageOfPatientsPerAgeGroupColumns, regularStatColumns } from "./columns";

const StatTables = () => {
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
