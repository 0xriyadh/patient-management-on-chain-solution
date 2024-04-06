var PatientManagement = artifacts.require("./PatientManagement.sol");

module.exports = function (deployer) {
    deployer.deploy(PatientManagement);
};
