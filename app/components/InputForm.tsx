"use client";

import { Web3 } from "web3";
import MyNameContractDeployment from "../../build/contracts/MyName.json";
import PatientManagementContractDeployment from "../../build/contracts/PatientManagement.json";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    const [connectedAccount, setConnectedAccount] = useState("null");

    const address = PatientManagementContractDeployment.networks[5777].address;
    const patientManagementContract = new provider.eth.Contract(
        PatientManagementContractDeployment.abi,
        address
    );

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
                    "Dhaka",
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
        patientManagementContract.events
            .NewPatientAdded()
            .on("data", async (event) => {
                console.log(event);
            });
    }, [patientManagementContract.events]);

    useEffect(() => {
        const getPastEvents = async () => {
            if (patientManagementContract) {
                const events = await (
                    patientManagementContract.getPastEvents as any
                )("NewPatientAdded", {
                    fromBlock: 0,
                    toBlock: "latest",
                });

                console.log(events);
                for (const event of events) {
                    const block = await provider.eth.getBlock(
                        event.blockNumber
                    );
                    const timestamp = block.timestamp;

                    console.log(
                        "Event emitted at",
                        new Date(Number(block.timestamp) * 1000)
                    );
                }
            }
        };

        getPastEvents();
    }, [patientManagementContract]);

    return (
        <>
            <h1 className="text-2xl">Owner Address: {owner}</h1>
            <h1 className="text-2xl">Connected Account: {connectedAccount}</h1>
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
