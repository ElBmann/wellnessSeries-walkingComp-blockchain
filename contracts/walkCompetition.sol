// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract walkCompetition{
   
    uint256 totalMiles;
 address payable public owner;
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
    
    mapping(address => Athlete) athletes;
    address[] athleteAccts;

    //Athlete[] public athletes;
    Mile[] miles;
   
    constructor() payable{
         owner = payable(msg.sender);
        console.log("YOOO %s" ,owner);
    }
    event ValueReceived(address user, uint amount);

      receive() external payable {

          emit ValueReceived(msg.sender, msg.value);
      }

      // fallback() external payable {}
  function transfer(address payable _to, uint _amount) public {
        // Note that "to" is declared as payable
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

      function getBalance() public view returns (uint) {
        return address(this).balance;
    }
function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        uint256 number = 1;
        console.log("msg.value ", msg.value);
        (bool sent, bytes memory data) = _to.call{value: number}("");
        console.log("sent: ",sent);
        require(sent, "Failed to send Ether");
    }
    mapping (address => uint256) public walkBets;

    function takeBet(address user) external payable{
        console.log('take Bet',msg.value);
            walkBets[user] += msg.value;
    }

    function mile(uint8 _mile) public{
        
        miles.push(Mile(msg.sender, _mile, block.timestamp));
        //Athlete storage athlete = athletes[_address];
        //athlete.milesWalked += _mile;

        totalMiles += 1;
        console.log("Has walked %s ",_mile);
         
        console.log("Has walked %s ",msg.sender);
        emit NewMile(msg.sender, block.timestamp, _mile);
    }

    function betPlaced(uint256 _bet, string memory AName, address _address)payable public{
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

    function getAllMiles()public view returns(Mile[] memory) {
         
         return miles;
    }
     function getTotalMiles() public view returns (uint256){
        console.log("We have %d total miles!",totalMiles);
        return totalMiles;
    }



}
 
 