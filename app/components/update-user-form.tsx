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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BANGLADESH_DISTRICTS } from "../data/constant-bd-districts";
import { toast } from "sonner";

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

export function UpdateUserForm() {
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
                        Update Patient {!connectedAccount && "(Connect Metamask)"}
                    </Button>
                </form>
            </Form>
        </>
    );
}
