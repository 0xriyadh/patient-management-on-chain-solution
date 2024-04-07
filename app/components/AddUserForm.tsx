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

export function AddUserForm() {
    const [owner, setOwner] = useState<string | null>(null);
    const [connectedAccount, setConnectedAccount] = useState<string | null>(
        null
    );
    const [userAdded, setUserAdded] = useState(false);

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
            age: "",
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
                    true,
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

    return (
        <>
            <h1 className="text-2xl">Owner Address: {owner}</h1>
            <h1 className="text-2xl">Connected Account: {connectedAccount}</h1>
            <Button
                disabled={!!connectedAccount}
                type="submit"
                onClick={connectMetamask}
            >
                {connectedAccount
                    ? "Metamask Connected ✅"
                    : "Connect to Metamask"}
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
                    <Button disabled={!connectedAccount} type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </>
    );
}
