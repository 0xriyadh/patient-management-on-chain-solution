"use client";
import { Web3 } from "web3";
import ABI from "../data/abi/MyNameABI.json";
import { useEffect, useState } from "react";

//initialize ganache provider
const provider = new Web3("HTTP://127.0.0.1:8545");

const GetName = () => {
    const [name, setName] = useState<string | null>("null");

    const getName = async (): Promise<string> => {
        //initialize contract
        const address = "0xfdFA2a8A9B0cFe3a34378EC4ef889a7Fb328C0fC";
        const myContract = new provider.eth.Contract(ABI, address);

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
        </div>
    );
};

export default GetName;
