// hooks/usePastEvents.ts
import { useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import PatientManagementContractDeployment from "../../build/contracts/PatientManagement.json";
import provider from "../utils/web3Provider";

const usePastEvents = (
    patientManagementContract: Contract<
        typeof PatientManagementContractDeployment.abi
    >
) => {
    const [newPatientAddedEvents, setNewPatientAddedEvents] = useState([]);
    const [totalDays, setTotalDays] = useState(0);

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

                // calculating from first block to latest block
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

                if (events.length > 0) {
                    const firstBlock = await provider.eth.getBlock(
                        events[0].blockNumber
                    );
                    const firstTimestamp = firstBlock.timestamp;
                    const currentTimestamp = Math.floor(Date.now() / 1000);

                    const days = Math.ceil(
                        (currentTimestamp - Number(firstTimestamp)) /
                            (60 * 60 * 24)
                    );
                    setTotalDays(days);
                }
            }
        };

        getPastEvents();
    }, [patientManagementContract]);

    return { newPatientAddedEvents, totalDays };
};

export default usePastEvents;
