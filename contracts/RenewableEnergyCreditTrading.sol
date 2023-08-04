// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract RenewableEnergyCreditTrading is Initializable {
    address public owner;
    uint public nextCreditId;

    struct RenewableEnergyCredit {
        uint creditId;
        address seller;
        uint quantity;
        uint pricePerUnit;
        bool isAvailable;
    }

    mapping(uint => RenewableEnergyCredit) public credits;
    uint[] public listedCreditIds; // Keep track of creditIds that are listed for sale

    event CreditListed(
        uint indexed creditId,
        address indexed seller,
        uint quantity,
        uint pricePerUnit
    );
    event TradeCompleted(
        uint indexed creditId,
        address indexed buyer,
        uint quantity,
        uint totalPrice
    );

    // Mapping to store the energy credits for each user
    mapping(address => uint) public energyCredits;

    // Function to increment the energy credits for a user by 1
    function incrementEnergyCredits(address user) external onlyOwner {
        energyCredits[user]++;
    }

    // Note: The constructor has been replaced with an initializer
    function initialize() public initializer {
        owner = msg.sender;
        nextCreditId = 1;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }

    function listCreditForSale(uint quantity, uint pricePerUnit) external {
        require(quantity > 0, "Quantity must be greater than zero");
        require(pricePerUnit > 0, "Price per unit must be greater than zero");

        credits[nextCreditId] = RenewableEnergyCredit(
            nextCreditId,
            msg.sender,
            quantity,
            pricePerUnit,
            true
        );

        listedCreditIds.push(nextCreditId);

        emit CreditListed(nextCreditId, msg.sender, quantity, pricePerUnit);

        nextCreditId++;
    }

    function buyCredits(uint creditId, uint quantity) external payable {
        require(quantity > 0, "Quantity must be greater than zero");
        require(
            credits[creditId].isAvailable,
            "Credit is not available for sale"
        );
        require(
            quantity <= credits[creditId].quantity,
            "Insufficient credits available for sale"
        );
        require(
            msg.value == quantity * credits[creditId].pricePerUnit,
            "Insufficient payment"
        );

        address seller = credits[creditId].seller;
        uint totalPrice = quantity * credits[creditId].pricePerUnit;

        credits[creditId].quantity -= quantity;

        if (credits[creditId].quantity == 0) {
            credits[creditId].isAvailable = false;
        }

        payable(seller).transfer(totalPrice);

        emit TradeCompleted(creditId, msg.sender, quantity, totalPrice);
    }

    // Function to get the list of renewable energy credits available for sale in the market
    function getListedCredits()
        external
        view
        returns (RenewableEnergyCredit[] memory)
    {
        RenewableEnergyCredit[]
            memory listedCredits = new RenewableEnergyCredit[](
                listedCreditIds.length
            );
        for (uint i = 0; i < listedCreditIds.length; i++) {
            listedCredits[i] = credits[listedCreditIds[i]];
        }
        return listedCredits;
    }
}
