// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract walkCompetition{
   
    uint totalMiles;

    event NewMile(address indexed from, uint256 timestamp, uint8 walkedMiles);

    struct Mile{
        address walker;
        uint8 walkedMiles;
        uint256 timestamp;
    }
    struct Bets{
        address walker;
        uint8 betPlaced;
        uint256 timestamp;
    }
    Mile[] miles;
    Bets[] bet;
    constructor() payable{
        console.log("YOOO");
    }
    function mile(uint8 _mile) public{
        totalMiles += 1;
        console.log("Has walked %s ",_mile);
        miles.push(Mile(msg.sender, _mile, block.timestamp));
        console.log("Has walked %s ",msg.sender);
        emit NewMile(msg.sender, block.timestamp, _mile);
    }

    function fundContract(uint8 _bet) public{
        console.log("Bet placed %s",_bet);
        bet.push(Bets(msg.sender,_bet,block.timestamp));
        

    }

    function getTotalmiles()public view returns(Mile[] memory) {
         
         return miles;
    }
}