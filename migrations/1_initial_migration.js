var MyName = artifacts.require("./MyName.sol");
var PatientManagement = artifacts.require("./PatientManagement.sol");

module.exports = function (deployer) {
    deployer.deploy(MyName);
    deployer.deploy(PatientManagement);
};
