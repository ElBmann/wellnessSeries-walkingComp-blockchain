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

// let mileCount;
// mileCount = await walkContract.getTotalmiles();
// console.log(mileCount);


// let mileTxn = await walkContract.mile(23);
// await mileTxn.wait();

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