"use client";
import { Web3 } from "web3";
import MyNameContractDeployment from "../../build/contracts/MyName.json";
import { useEffect, useState } from "react";
import { InputForm } from "./InputForm";

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

const GetName = () => {
    const [name, setName] = useState<string | null>("null");

    const getName = async (): Promise<string> => {
        //initialize contract
        const address = MyNameContractDeployment.networks[5777].address;
        const myContract = new provider.eth.Contract(
            MyNameContractDeployment.abi,
            address
        );

        //make call
        const result = (await myContract.methods.name().call()) as string;

        return result;
    };

    useEffect(() => {
        getName().then((result: string) => {
            setName(result);
        });
    }, []);

    return (
        <div>
            <h1>My Name is: {name}</h1>
            <InputForm />
        </div>
    );
};

export default GetName;
