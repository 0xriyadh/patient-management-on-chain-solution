// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract PatientManagement {
    error PatientManagement_NotAdmin();
    error PatientManagement_DidNotFindUser();
    error PatientManagement_UserAlreadyExists();

    event NewPatientAdded(
        address indexed patientAddress,
        uint256 indexed age,
        string indexed district
    );
    event APatientIsDead(
        address indexed patientAddress,
        uint256 indexed age,
        string indexed district
    );

    mapping(address => User) private s_addressToUser;
    uint256 private s_userCount = 0;
    address private s_owner;

    // creating an admin user at the time of contract deployment
    constructor() {
        addUser(
            msg.sender,
            25, // age
            Gender.Male, // gender
            VaccineStatus.two_dose, // vaccine status
            "Dhaka", // district
            "No symptoms", // symptoms details
            false, // is dead
            Role.Admin // role
        );
        s_owner = msg.sender;
    }

    enum Role {
        Patient,
        Admin
    }
    enum VaccineStatus {
        not_vaccinated,
        one_dose,
        two_dose
    }
    enum Gender {
        Male,
        Female
    }
    struct User {
        uint256 id;
        uint256 age;
        Gender gender;
        VaccineStatus vaccine_status;
        string district;
        string symptoms_details;
        bool is_dead;
        Role role;
    }

    function addUser(
        address _patientAddress,
        uint256 _age,
        Gender _gender,
        VaccineStatus _vaccine_status,
        string memory _district,
        string memory _symptoms_details,
        bool _is_dead,
        Role _role
    ) public {
        if (s_addressToUser[_patientAddress].id != 0) {
            revert PatientManagement_UserAlreadyExists();
        }

        s_userCount++;
        s_addressToUser[_patientAddress] = User({
            id: s_userCount,
            age: _age,
            gender: _gender,
            vaccine_status: _vaccine_status,
            district: _district,
            symptoms_details: _symptoms_details,
            is_dead: _is_dead,
            role: _role
        });

        emit NewPatientAdded(_patientAddress, _age, _district);
    }

    function getUser(
        address _address
    )
        public
        view
        returns (
            uint256 userId,
            uint256 age,
            Gender gender,
            VaccineStatus vaccine_status,
            string memory district,
            string memory symptoms_details,
            bool is_dead,
            Role role
        )
    {
        User memory user = s_addressToUser[_address];
        return (
            user.id,
            user.age,
            user.gender,
            user.vaccine_status,
            user.district,
            user.symptoms_details,
            user.is_dead,
            user.role
        );
    }

    // function to update user's vaccine status or is_dead status. Only Admin can call this function
    function updateUser(
        address _address,
        VaccineStatus _vaccine_status,
        bool _is_dead
    ) public {
        if (Role(s_addressToUser[msg.sender].role) != Role.Admin) {
            revert PatientManagement_NotAdmin();
        }
        s_addressToUser[_address].vaccine_status = _vaccine_status;
        s_addressToUser[_address].is_dead = _is_dead;

        if (_is_dead) {
            emit APatientIsDead(
                _address,
                s_addressToUser[_address].age,
                s_addressToUser[_address].district
            );
        }
    }

    function getUserCount() public view returns (uint256) {
        return s_userCount;
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }
}
