"use client";

import { Web3 } from "web3";
import MyNameContractDeployment from "../../build/contracts/MyName.json";
import PatientManagementContractDeployment from "../../build/contracts/PatientManagement.json";
import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { isAddress } from "ethers";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Initialize Web3 provider
let provider: Web3;
if (
    typeof window !== "undefined" &&
    typeof (window as any).ethereum !== "undefined"
) {
    provider = new Web3((window as any).ethereum);
} else {
    provider = new Web3("http://localhost:8545");
}

const FormSchema = z.object({
    ethAddress: z.custom<string>(isAddress, "Invalid Address"),
    age: z.string().refine(
        (val) => {
            const num = parseInt(val, 10);
            return !Number.isNaN(num) && num > 0;
        },
        {
            message: "Expected a positive number",
        }
    ),
});

export function InputForm() {
    const [owner, setOwner] = useState<string | null>("null");
    const [connectedAccount, setConnectedAccount] = useState<string | null>(
        "null"
    );
    const [NewPatientAddedEvents, setNewPatientAddedEvents] = useState<any[]>(
        []
    );
    const [APatientIsDeadEvents, setAPatientIsDeadEvents] = useState<any[]>([]);
    const [userAdded, setUserAdded] = useState(false);
    const [userUpdated, setUserUpdated] = useState(false);
    // death rate per day
    const [deathRate, setDeathRate] = useState(0);
    // total num of days since the first block was created
    const [totalDays, setTotalDays] = useState(0);
    // district with highest number of patients
    const [highestPatientDistrict, setHighestPatientDistrict] = useState("");

    const patientManagementContract = useMemo(() => {
        const address =
            PatientManagementContractDeployment.networks[5777].address;
        return new provider.eth.Contract(
            PatientManagementContractDeployment.abi,
            address
        );
    }, []);

    const getOwnerAddress = async (): Promise<string> => {
        const result = (await patientManagementContract.methods
            .getOwner()
            .call()) as string;

        return result;
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ethAddress: "",
            age: "1",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        if (connectedAccount) {
            patientManagementContract.methods
                .addUser(
                    data.ethAddress,
                    data.age,
                    0,
                    0,
                    "Barishal",
                    "No Symptoms",
                    false,
                    0
                )
                .send({ from: connectedAccount || "" })
                // .on("receipt", function (receipt) {
                //     console.log(receipt.events); // All the events from the receipt
                // })
                .then(() => {
                    console.log("Success");
                    setUserAdded(true);
                })
                .catch((err: Error) => {
                    console.error(err.message);
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

    useEffect(() => {
        getOwnerAddress().then((result: string) => {
            setOwner(result);
        });
    });

    useEffect(() => {
        const getPastEvents = async () => {
            if (patientManagementContract) {
                const events = await (
                    patientManagementContract.getPastEvents as any
                )("NewPatientAdded", {
                    fromBlock: 0,
                    toBlock: "latest",
                });

                setNewPatientAddedEvents(events);
                console.log(events);

                // consoling the times each events were emitted at
                /*
                    for (const event of events) {
                        const block = await provider.eth.getBlock(
                            event.blockNumber
                        );
                        const timestamp = block.timestamp;

                        console.log(
                            "Event emitted at",
                            new Date(Number(timestamp) * 1000)
                        );
                    }
                */

                // calculating from first block to latest
                /*
                    if (events.length > 0) {
                        // Get the timestamp of the first block
                        const firstBlock = await provider.eth.getBlock(
                            events[0].blockNumber
                        );
                        const firstTimestamp = firstBlock.timestamp;

                        // Get the timestamp of the latest block
                        const latestBlock = await provider.eth.getBlock("latest");
                        const latestTimestamp = latestBlock.timestamp;

                        // Calculate the number of days from the first block to the latest
                        const days = Math.ceil(
                            Number(latestTimestamp - firstTimestamp) /
                                (60 * 60 * 24)
                        );
                        console.log(
                            "Number of days from the first block to the latest:",
                            days
                        );
                    } 
                */

                // calculating from first block to now
                if (events.length > 0) {
                    // Get the timestamp of the first block
                    const firstBlock = await provider.eth.getBlock(
                        events[0].blockNumber
                    );
                    const firstTimestamp = firstBlock.timestamp;

                    // Get the current timestamp in seconds
                    const currentTimestamp = Math.floor(Date.now() / 1000);

                    // Calculate the number of days from the first block to the current time
                    const days = Math.ceil(
                        (currentTimestamp - Number(firstTimestamp)) /
                            (60 * 60 * 24)
                    );
                    console.log(
                        "Number of days from the first block to the current time:",
                        days
                    );
                    setTotalDays(days);
                }
            }
        };

        // Only get past events if a new user has been added
        if (userAdded || !NewPatientAddedEvents.length) {
            getPastEvents();
            // Reset userAdded to false after getting past events
            setUserAdded(false);
        }
    }, [patientManagementContract, userAdded, NewPatientAddedEvents.length]);

    useEffect(() => {
        const getPastEvents = async () => {
            if (patientManagementContract) {
                const events = await (
                    patientManagementContract.getPastEvents as any
                )("APatientIsDead", {
                    fromBlock: 0,
                    toBlock: "latest",
                });

                setAPatientIsDeadEvents(events);
                console.log(events);
            }
        };

        // Only get past events if a new user has been added
        if (userUpdated || userAdded || !APatientIsDeadEvents.length) {
            getPastEvents();
            // Reset userAdded to false after getting past events
            setUserUpdated(false);
            setUserAdded(false);
        }
    }, [
        patientManagementContract,
        userAdded,
        userUpdated,
        APatientIsDeadEvents.length,
    ]);

    useEffect(() => {
        if (totalDays > 0) {
            setDeathRate(APatientIsDeadEvents.length / totalDays);
        }
    }, [totalDays, APatientIsDeadEvents.length]);

    useEffect(() => {
        if (NewPatientAddedEvents.length > 0) {
            const districtPatientCount: { [district: string]: number } = {};

            NewPatientAddedEvents.forEach((event) => {
                const district = event.returnValues.district;
                if (districtPatientCount[district]) {
                    districtPatientCount[district]++;
                } else {
                    districtPatientCount[district] = 1;
                }
            });
            console.log(districtPatientCount);
            let maxDistrict = Object.keys(districtPatientCount)[0];
            let maxCount = districtPatientCount[maxDistrict];

            for (const district in districtPatientCount) {
                if (districtPatientCount[district] > maxCount) {
                    maxDistrict = district;
                    maxCount = districtPatientCount[district];
                }
            }

            console.log(
                `District with highest number of patients: ${maxDistrict}`
            );
            setHighestPatientDistrict(maxDistrict);
        }
    }, [NewPatientAddedEvents]);

    return (
        <>
            <h1 className="text-2xl">Owner Address: {owner}</h1>
            <h1 className="text-2xl">Connected Account: {connectedAccount}</h1>
            <h1 className="text-lg">Death Rate: {deathRate}</h1>
            <h1 className="text-lg">
                Highest Covid Patient&apos;s District: {highestPatientDistrict}
            </h1>
            <Button type="submit" onClick={connectMetamask}>
                Connect to MetaMask
            </Button>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="ethAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
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
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Age"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
