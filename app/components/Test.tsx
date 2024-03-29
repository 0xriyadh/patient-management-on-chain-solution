"use client";
import { useState } from "react";
import { Web3 } from "web3";

const Test = () => {
    const [connectedAccount, setConnectedAccount] = useState("null");

    async function connectMetamask() {
        //check metamask is installed
        if (window.ethereum) {
            // instantiate Web3 with the injected provider
            const web3 = new Web3(window.ethereum);

            //request user to connect accounts (Metamask will prompt)
            await window.ethereum.request({ method: "eth_requestAccounts" });

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
            {/* Button to trigger Metamask connection */}
            <button onClick={() => connectMetamask()}>
                Connect to Metamask
            </button>

            {/* Display the connected account */}
            <h2>{connectedAccount}</h2>
        </>
    );
};

export default Test;
