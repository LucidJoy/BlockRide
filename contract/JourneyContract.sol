// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract UberThree {
    address payable admin;
    mapping(address => uint256) public totalRides;
    mapping(address => bool) public blacklistStatus;
    address[] public blacklisted;

    constructor() {
        admin = payable(msg.sender);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized!");
        _;
    }

    function acceptPayment() public payable {
        totalRides[msg.sender]++;
    }

    function blacklistUser(address _user) public {
        blacklisted.push(_user);
        blacklistStatus[_user] = true;
    }

    function revokeBlacklistUser(address _user) public {
        blacklistStatus[_user] = false;
    }

    function getBlacklistStatus(address _user) public view returns (bool) {
        return blacklistStatus[_user];
    }

    function withdraw() public payable onlyAdmin {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function balance() public view onlyAdmin returns (uint256) {
        return address(this).balance;
    }
}
