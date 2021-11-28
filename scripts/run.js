const main = async ()=>{
    const walkContractFactory = await hre.ethers.getContractFactory('walkCompetition');
    const walkContract = await walkContractFactory.deploy();
    await walkContract.deployed();
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