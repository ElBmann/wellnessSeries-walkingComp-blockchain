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
        uint256 betPlaced;
        uint256 timestamp;
    }
    Mile[] public miles;
    Bets[] public bet;
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

    function fundContract(uint256 _bet) public{
        console.log("Bet placed %s",_bet);
        bet.push(Bets(msg.sender,_bet,block.timestamp));
         console.log("Has placed Bet %s ",msg.sender);
        //uint256 prizePool = _bet ether;

    }

    function getTotalmiles()public view returns(uint) {
         
         return miles[0].walkedMiles;
    }
    function getPoolTotal()public view returns(uint) {
         uint x = 0;
         uint total = 0;
         console.log('TEST HERE');
        for(x; x < bet.length; x++){
           console.log("TEST HERE : %s ", bet[x].betPlaced);
          total += bet[x].betPlaced; 
        }

         return total;
    }


}