import Web3 from "web3";

let provider: Web3;
if (
    typeof window !== "undefined" &&
    typeof (window as any).ethereum !== "undefined"
) {
    provider = new Web3((window as any).ethereum);
} else {
    provider = new Web3("http://localhost:8545");
}

export default provider;
