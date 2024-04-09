# Patient Management On Chain Solution (PMOCS)

PMOCS is a blockchain-based solution for managing patient data, implemented using Solidity, Truffle, Ganache, and NextJs. The system allows for the registration and updating of patient records, with a focus on tracking COVID-19 trends and vaccination status.

## Features

- **Blockchain-Based Patient Records**: Patient data is securely stored on the blockchain, ensuring data integrity and transparency.
- **COVID-19 Trend Tracking**: The system provides a comprehensive overview of COVID-19 trends, including average death rates, the district with the highest number of patients, and the median age of patients.
- **Vaccination Status Tracking**: The vaccination status of each patient is tracked in the system, with the ability to update the status as patients receive their vaccines.
- **Vaccine Certificate**: Patients who have received two doses of the vaccine can download a vaccine certificate directly from the system.
- **Automatic Data Update**: The system automatically updates COVID-19 trend data as patient records are updated.

## Getting Started

To get started with PMOCS, follow these steps:
1. Spin up a local blockchain network using Ganache.
clone the repository and install the dependencies:

```bash
git clone https://github.com/mahadihassanriyadh/patient-management-on-chain-solution
cd patient-management-on-chain-solution`
npm install
```

Then, start the local development server:
```bash
npm run dev
```