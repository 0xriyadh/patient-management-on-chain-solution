# Patient Management On Chain Solution (PMOCS)

PMOCS is a blockchain-based solution for managing patient data, implemented using Solidity, Truffle, Ganache, and NextJs. The system allows for the registration and updating of patient records, with a focus on tracking COVID-19 trends and vaccination status.

<img width="1426" alt="Screenshot 2024-04-10 at 4 19 13 AM" src="https://github.com/mahadihassanriyadh/patient-management-on-chain-solution/assets/77486566/e233921b-94e2-4c9b-a9b4-57f8dd535774">
<img width="1429" alt="Screenshot 2024-04-10 at 4 18 37 AM" src="https://github.com/mahadihassanriyadh/patient-management-on-chain-solution/assets/77486566/7b533c60-f1f3-4f54-8ccb-99a4d6f22855">
<img width="1429" alt="Screenshot 2024-04-10 at 4 18 37 AM" src="https://github.com/mahadihassanriyadh/patient-management-on-chain-solution/assets/77486566/58957c50-f7b7-4d2d-92aa-d39954511430">
<img width="1424" alt="Screenshot 2024-04-10 at 4 20 04 AM" src="https://github.com/mahadihassanriyadh/patient-management-on-chain-solution/assets/77486566/050e04cc-87a7-4687-9348-26a7c553ff00">


## Features

- **Blockchain-Based Patient Records**: Patient data is securely stored on the blockchain, ensuring data integrity and transparency.
- **COVID-19 Trend Tracking**: The system provides a comprehensive overview of COVID-19 trends, including average death rates, the district with the highest number of patients, and the median age of patients.
- **Vaccination Status Tracking**: The vaccination status of each patient is tracked in the system, with the ability to update the status as patients receive their vaccines.
- **Vaccine Certificate**: Patients who have received two doses of the vaccine can download a vaccine certificate directly from the system.
- **Automatic Data Update**: The system automatically updates COVID-19 trend data as patient records are updated.

## Getting Started

To get started with PMOCS, follow these steps:
1. Spin up a local blockchain network in [Ganache](https://archive.trufflesuite.com/ganache/) using the following configuration:
    - Hostname: `127.0.0.1 (Localhost)`
    - Port: `8545`
    - Network ID: `5777`
2. Clone the repository and install the dependencies:
```bash
git clone https://github.com/mahadihassanriyadh/patient-management-on-chain-solution
cd patient-management-on-chain-solution`
npm install
```
3. Deploy the PatientManagement.sol contract on the local blockchain network (Ganache) using Truffle:
```bash
make migrate
```
or
```bash
truffle migrate --reset
```
4. Start the local development server:
```bash
npm run dev
```
5. Access the application at `http://localhost:3000`
