import { Contract } from "web3-eth-contract";
import PatientManagementContractDeployment from "../../build/contracts/PatientManagement.json";
import provider from "../utils/web3Provider";

const address = PatientManagementContractDeployment.networks[5777].address;
const patientManagementContract: Contract<any> = new provider.eth.Contract(
    PatientManagementContractDeployment.abi,
    address
);

export default patientManagementContract;
