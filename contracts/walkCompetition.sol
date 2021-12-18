// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract walkCompetition{
   
    uint totalMiles;

    event NewMile(address indexed from, uint256 timestamp, uint8 walkedMiles);

    struct Athlete{
        address athleteID;
        string name;
        uint256 betPlaced;
        uint256 milesWalked;
        uint256 timestamp;

    }

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
    mapping(address => Athlete) athletes;
    address[] athleteAccts;

    //Athlete[] public athletes;
    Mile[] public miles;
    Bets[] public bet;
    constructor() payable{
        console.log("YOOO");
    }
    function mile(uint8 _mile) public{
        totalMiles += 1;
        console.log("Has walked %s ",_mile);
        
        console.log("Has walked %s ",msg.sender);
        emit NewMile(msg.sender, block.timestamp, _mile);
    }

    function betPlaced(uint256 _bet, string memory AName, address _address) public{
        Athlete storage athlete = athletes[_address];
        athlete.athleteID = _address;
        athlete.name = AName;
        athlete.betPlaced = _bet;
        athlete.timestamp =block.timestamp;
        

        athleteAccts.push(msg.sender);

        //Athlete memory athlete = Athlete(msg.sender, AName ,_bet,3,block.timestamp);
       // athletes[msg.sender] = athlete;
       
        console.log("Bet placed %s",_bet);
        //bet.push(Bets(msg.sender,_bet,block.timestamp));
         console.log("Has placed Bet %s ",msg.sender);
        
        
        //uint256 prizePool = _bet ether;

    }
    function getAthletes(address _address)  public view returns (string memory, uint256, uint256){
        
        return (athletes[_address].name,athletes[_address].betPlaced, athletes[_address].milesWalked);
    }

    function getTotalmiles()public view returns(Mile[] memory) {
         
         return miles;
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
    function chooseWinner() public view{
         uint x = 0;
         uint largest = 0;
         address winnerAdd;
         console.log('TEST HERE');
         //TODO: make this so it adds all wallets mileage and compares to see which wallet has the most miles
        for(x; x < miles.length; x++){
           console.log("TEST HERE : %s ", miles[x].walkedMiles);
            if(miles[x].walkedMiles > largest){
                largest = miles[x].walkedMiles;
                winnerAdd = miles[x].walker;
            }
         
        }
        console.log("Largest Number", largest);
        console.log("Winner Address", winnerAdd);
    }


}