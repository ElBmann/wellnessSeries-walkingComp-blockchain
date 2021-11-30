pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract walkCompetition{
    
    uint totalMiles;
    constructor(){
        console.log("YOOO");
    }
    function miles() public{
        totalMiles += 1;
        console.log("Has walked %s ",msg.sender);
    }
    function getTotalmiles()public view returns(uint256) {
         console.log("Current Miles",totalMiles," Walked by ", msg.sender);
         return totalMiles;
    }
}