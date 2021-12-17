const main = async ()=>{
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const walkContractFactory = await hre.ethers.getContractFactory('walkCompetition');
    const walkContract = await walkContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.00001'),
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


let mileTxn = await walkContract.fundContract(23);
//await mileTxn.wait();
 mileTxn = await walkContract.fundContract(1);
//await mileTxn.wait();
 mileTxn = await walkContract.fundContract(6);
await mileTxn.wait();

 let mileCount;
 mileCount = await walkContract.getPoolTotal();
 console.log("get mile count" + mileCount);




// mileCount = await walkContract.getTotalmiles();
// console.log(mileCount);



// const [_, randomPerson] = await hre.ethers.getSigners();
// mileTxn = await walkContract.connect(randomPerson).mile(2);
// await mileTxn.wait(); // Wait for the transaction to be mined

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