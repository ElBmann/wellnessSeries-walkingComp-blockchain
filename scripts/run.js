const main = async ()=>{
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const walkContractFactory = await hre.ethers.getContractFactory('walkCompetition');
    const walkContract = await walkContractFactory.deploy();
    await walkContract.deployed();

    console.log("Contract deployed to:", walkContract.address);
    console.log("contact deployed by:", owner.address);

let mileCount;
mileCount = await walkContract.getTotalmiles();

let mileTxn = await walkContract.miles();
await mileTxn.wait();

mileCount = await walkContract.getTotalmiles();

mileTxn = await walkContract.connect(randomPerson).miles();
await mileTxn.wait();

mileCount = await walkContract.getTotalmiles();

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