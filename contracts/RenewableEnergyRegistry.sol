// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RenewableEnergyRegistry {
    address public owner;
    uint public nextEntryId;

    struct RenewableEnergyEntry {
        uint entryId;
        address producer;
        uint timestamp;
        uint energyAmount; // Energy amount in kilowatt-hours (kWh)
        string location; // Location of energy production
    }

    mapping(uint => RenewableEnergyEntry) public entries;

    event RenewableEnergyRegistered(
        uint indexed entryId,
        address indexed producer,
        uint timestamp,
        uint energyAmount,
        string location
    );

    constructor() {
        owner = msg.sender;
        nextEntryId = 1;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }

    function registerRenewableEnergy(
        uint timestamp,
        uint energyAmount,
        string memory location
    ) external {
        require(timestamp > 0, "Invalid timestamp");
        require(energyAmount > 0, "Energy amount must be greater than zero");

        entries[nextEntryId] = RenewableEnergyEntry(
            nextEntryId,
            msg.sender,
            timestamp,
            energyAmount,
            location
        );

        emit RenewableEnergyRegistered(
            nextEntryId,
            msg.sender,
            timestamp,
            energyAmount,
            location
        );

        nextEntryId++;
    }
}
