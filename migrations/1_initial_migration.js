var MyName = artifacts.require("./MyName.sol");

module.exports = function (deployer) {
    deployer.deploy(MyName);
};
