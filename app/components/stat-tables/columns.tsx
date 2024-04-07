"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RegularStat = {
    death_rate: number;
    district: string; // district with the highest patients
};

export const regularStatColumns: ColumnDef<RegularStat>[] = [
    {
        accessorKey: "death_rate",
        header: "Death Rate",
    },
    {
        accessorKey: "district",
        header: "District with Highest Patients",
    },
];

export type MedianAgePerDistrict = {
    district: string;
    age: number;
};

export const medianAgePerDistrictColumns: ColumnDef<MedianAgePerDistrict>[] = [
    {
        accessorKey: "district",
        header: "District",
    },
    {
        accessorKey: "age",
        header: "Median Age",
    },
];

export type PercentageOfPatientsPerAgeGroup = {
    group: string;
    percentage: number;
};

export const percentageOfPatientsPerAgeGroupColumns: ColumnDef<PercentageOfPatientsPerAgeGroup>[] =
    [
        {
            accessorKey: "group",
            header: "Age Group",
        },
        {
            accessorKey: "percentage",
            header: "Percentage (%)",
        },
    ];
