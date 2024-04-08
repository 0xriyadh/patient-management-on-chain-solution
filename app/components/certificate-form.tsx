"use client";

import { Web3 } from "web3";
import { useState } from "react";

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
import { toast } from "sonner";

const FormSchema = z.object({
    ethAddress: z.custom<string>(isAddress, "Invalid Address"),
});

export function CertificateForm() {
    const [connectedAccount, setConnectedAccount] = useState<string | null>(
        null
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ethAddress: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (connectedAccount) {
            const user: (string | boolean | number | bigint)[] =
                await patientManagementContract.methods
                    .getUser(data.ethAddress)
                    .call();
            const vaccineStatus = user[3];
            if (vaccineStatus === BigInt(2)) {
                toast.success("Certificate downloaded successfully");
            } else {
                toast.error("User is not fully vaccinated");
            }
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
                ☑️ Download Certificate
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
                                <FormLabel>
                                    Patient&apos;s Ethereum Address
                                </FormLabel>
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
                    <Button
                        disabled={!connectedAccount}
                        type="submit"
                        size="lg"
                        className="mt-10"
                    >
                        Download Certificate{" "}
                        {!connectedAccount && "(Connect Metamask)"}
                    </Button>
                </form>
            </Form>
        </>
    );
}
