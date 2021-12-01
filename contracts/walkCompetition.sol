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
    Mile[] miles;
    constructor(){
        console.log("YOOO");
    }
    function mile(uint8 _mile) public{
        totalMiles += 1;
        console.log("Has walked %s ",_mile);
        miles.push(Mile(msg.sender, _mile, block.timestamp));
        console.log("Has walked %s ",msg.sender);
        emit NewMile(msg.sender, block.timestamp, _mile);
    }
    function getTotalmiles()public view returns(Mile[] memory) {
         
         return miles;
    }
}