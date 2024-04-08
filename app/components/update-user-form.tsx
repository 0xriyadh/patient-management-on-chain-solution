"use client";

import { Web3 } from "web3";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAddress } from "ethers";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import patientManagementContract from "../config/patientManagementContract";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAllUsers } from "../utils/users";
import { User } from "../types/userTypes";

const FormSchema = z.object({
    ethAddress: z.custom<string>(isAddress, "Invalid Address"),
    vaccine_status: z
        .enum(["0", "1", "2"])
        .refine((value) => ["0", "1", "2"].includes(value), {
            message:
                "Vaccine status must be '0' (Not Vaccinated), '1' (One Dose), or '2' (Two Doses)",
        }),
    is_dead: z
        .enum(["true", "false"])
        .refine((value) => ["true", "false"].includes(value), {
            message: "Is Dead must be either 'true' or 'false'",
        }),
});

const VaccineStatus: { [key: number]: string } = {
    0: "Not Vaccinated",
    1: "One Dose",
    2: "Two Dose",
};

export function UpdateUserForm() {
    const [users, setUsers] = useState<User[]>([]);
    const [userAdded, setUserAdded] = useState(false);
    const [userUpdated, setUserUpdated] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState<string | null>(
        null
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ethAddress: "",
            vaccine_status: undefined,
            is_dead: undefined,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (connectedAccount) {
            patientManagementContract.methods
                .updateUser(
                    data.ethAddress,
                    parseInt(data.vaccine_status, 10), // Convert vaccine_status to number
                    data.is_dead === "true" // Convert is_dead to boolean
                )
                .send({ from: connectedAccount || "" })
                .then(() => {
                    toast.success("Patient updated successfully");
                })
                .catch((err: Error) => {
                    toast.error(err.message);
                });
        }
    }

    async function connectMetamask() {
        //check metamask is installed
        if (window.ethereum) {
            // instantiate Web3 with the injected provider
            const web3 = new Web3(window.ethereum);

            //request user to connect accounts (Metamask will prompt)
            await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            //get the connected accounts
            const accounts = await web3.eth.getAccounts();

            //show the first connected account in the react page
            setConnectedAccount(accounts[0]);
        } else {
            alert("Please download metamask");
        }
    }

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
        <>
            <div className="flex justify-center my-10">
                <Button
                    disabled={!!connectedAccount}
                    type="submit"
                    onClick={connectMetamask}
                    className="space-x-2"
                    size={"lg"}
                >
                    <span className="text-2xl">
                        {connectedAccount ? "✅" : "🦊"}
                    </span>
                    <span>
                        {connectedAccount
                            ? `${connectedAccount}`
                            : "Connect to Metamask"}
                    </span>
                </Button>
            </div>
            <h3 className="text-3xl font-medium w-2/3 space-y-2 mx-auto mb-6">
                ✍️ Update Patient
            </h3>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-2 mx-auto mb-16"
                >
                    <FormField
                        control={form.control}
                        name="ethAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ethereum Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eth Address"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vaccine_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vaccine Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kindly select patient's vaccine status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">
                                            Not Vaccinated
                                        </SelectItem>
                                        <SelectItem value="1">
                                            One Dose
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Two Dose
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_dead"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Dead?</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Is the user dead?" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="false">
                                            No
                                        </SelectItem>
                                        <SelectItem value="true">
                                            Yes
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={!connectedAccount}
                        type="submit"
                        size="lg"
                        className="mt-10"
                    >
                        Update Patient{" "}
                        {!connectedAccount && "(Connect Metamask)"}
                    </Button>
                </form>
            </Form>

            {/* showcasing all users */}
            <div className="my-10">
                <h3 className="text-3xl font-medium space-y-2 mx-auto mb-6">
                    📋 All Patients
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {users.map((user) => (
                        <div
                            key={user.address}
                            className={`p-8 bg-gray-100 rounded-md border ${
                                user.isDead ? "bg-red-50 border-red-500" : ""
                            } ${
                                BigInt(user.vaccineStatus) === BigInt(2) &&
                                !user.isDead
                                    ? "bg-green-50 border-green-500"
                                    : ""
                            }`}
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {user.address}
                                </p>
                                <p className="text-sm">
                                    Vaccine Status:{" "}
                                    {
                                        VaccineStatus[
                                            Number(
                                                user.vaccineStatus.toString()
                                            )
                                        ]
                                    }
                                </p>
                                <p className="text-sm">
                                    Is Dead: {user.isDead ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
