const main = async ()=>{
    const Tx = require("ethereumjs-tx");
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const walkContractFactory = await hre.ethers.getContractFactory('walkCompetition');
    const walkContract = await walkContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.0001'),
    });
    await walkContract.deployed();



   
    console.log("Contract deployed to:", walkContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        walkContract.address
    );

   
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );
//     console.log("contact deployed by:", owner.address);


let mileTxn = await walkContract.betPlaced(31,'Tony Eyes', '0x5FbDB2315678afecb367f032d93F642f64180aa3');
await mileTxn.wait();
// mileTxn = await walkContract.betPlaced(1,'Tony Eyes', owner);
//await mileTxn.wait();
 //mileTxn = await walkContract.betPlaced(6,'Tony Eyes',owner);
//await mileTxn.wait();


// mileCount = await walkContract.getTotalmiles();
// console.log(mileCount);



// const [_, randomPerson] = await hre.ethers.getSigners();
//console.log("BALANCE: ", hre.ethers.utils.formatEther(mileTxn));
 mileTxn = await walkContract.mile(4);
 await mileTxn.wait(); // Wait for the transaction to be mined
 mileTxn = await walkContract.takeBet('0x70997970c51812dc3a010c7d01b50e0d17dc79c8',{value: 0.0001});
 await mileTxn.wait(); // Wait for the transaction to be mined
 mileTxn = await walkContract.getBalance();
 console.log("BALANCE: ", hre.ethers.utils.formatEther(mileTxn));
 console.log(
    'Contract balance2:',
    hre.ethers.utils.formatEther(contractBalance)
);
//  console.log(
//   'Contract balance:',
//   hre.ethers.utils.formatEther(contractBalance)
// );
  // Wait for the transaction to be mined
// mileTxn = await walkContract.connect(randomPerson).betPlaced(4,'Ollie The pup',randomPerson);
 //await mileTxn.wait(); // Wait for the transaction to be mined
 //mileTxn = await walkContract.connect(randomPerson).betPlaced(6,'Ollie The pup', randomPerson);
// await mileTxn.wait(); // Wait for the transaction to be mined
 //mileTxn = await walkContract.connect(randomPerson).betPlaced(30,'Ollie The pup', randomPerson);
 //await mileTxn.wait(); // Wait for the transaction to be mined

// let GetASpecificA;
// GetASpecificA = await walkContract.getAthletes('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
// console.log("get mile count" + GetASpecificA);
 //mileTxn = await walkContract.connect(randomPerson).getAthletes('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
 //await GetASpecificA.wait(); // Wait for the transaction to be mined
//  let winner;
//  winner = await walkContract.chooseWinner();

//  console.log("winner winner chicken dinner " + winner);

let mileCount;
 mileCount = await walkContract.getTotalMiles();
 console.log("get mile count" + mileCount);
 
//  let fund;

//  fund = await hre.ethers.provider.sendTransaction();
//  await fund.wait(); // Wait for the transaction to be mined

//await walkContract.deposit();
 

};
const runMain = async () =>{
    try{
        await main();
        process.exit(0);
    }catch (error){
        console.log(error);
        process.exit(1);
    }
};
runMain();