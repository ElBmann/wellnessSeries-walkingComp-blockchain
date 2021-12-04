import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/walkCompetition.json';
import { default as strava, Strava } from 'strava-v3';
import fetchMiles from './scripts/getStravaAPI';
require('dotenv').config();
//Add Front End to Git. Please
const App = () => {
  const [allMiles, setAllMiles] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x8BEC6b8A62be9E4705755F62136aD710Af10CCe9";
  const contractABI = abi.abi;

  const getAllMiles = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);

        const walks = await WalkCompitionContract.getTotalmiles();
        console.log("walk.walkedMiles "+ walks);
        const milesCleaned = walks.map(walk => {
          console.log("walk.walkedMiles "+ walk.walkedMiles);
          return {
            address: walk.walker,
            timestamp: new Date(walk.timestamp * 1000),
            walkedMiles: walk.walkedMiles,
          };
        });

        setAllMiles(milesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        getAllMiles();
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }
 

  const apiGet = async () => {
    const strava = require('strava-v3');
    strava.config({
      "access_token"  : process.env.ACCESS_TOKEN,
      "client_id"     : '74956',
      "client_secret" : process.env.CLIENT_SECRET,
      "redirect_uri"  : "http://localhost:3000/",
    });
    // const payload = await strava.athlete.get(
    //   {'access_token':'d0a4383743e43217fdc9f8ef1dfc225681b8a017'},function(err,payload,limits) {
    //     console.log(payload);
      
    // });
    const authorizationCode = strava.oauth.getRequestAccessURL({scope:"activity:read"})
   // const stravaApi = new strava.client('d0a4383743e43217fdc9f8ef1dfc225681b8a017');
   // const payload = await stravaApi.athlete.get(
     // {'access_token':'d0a4383743e43217fdc9f8ef1dfc225681b8a017'},function(err,payload,limits) {
       // console.log(payload);
      
    //});
    console.log(authorizationCode);
   // const payload = await strava.oauth.getToken("code");
 
    
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Yo, Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted, ${name}`);
    setName("");

  }
  const vibes = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await WalkCompitionContract.getTotalmiles();
        console.log("Retrieved total vibe count...", count);

        const waveTxn = await WalkCompitionContract.mile(`${name}`);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await WalkCompitionContract.getTotalmiles();
        console.log("retrieved total vibe count...", count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
    console.log(window.location.href);
    var str = window.location.href.search(/code=/);
    var strScope = window.location.href.search(/&scope/);
    
    console.log(window.location.href.substr(str,strScope));
  }, [])
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          🚶‍♂️ Walking Competetion!
        </div>
        
        <div className="bio">
          I am Brian Connect your Ethereum wallet and wave at me, Add your strava username, and pick your start and end date for the walking competetion.
        </div>

        <form onSubmit={handleSubmit}>
          <input onChange={(e) => setName(e.target.value)} value={name}></input>
          <button className="waveButton" onClick={apiGet}>
            Set Miles Walked 🙌
          </button>

        </form>
        {allMiles.map((walk, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {walk.address}</div>
              <div>Time: {walk.timestamp.toString()}</div>
              <div>WalkedMiles: {walk.walkedMiles}</div>
            </div>)
        })}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        
      </div>
    </div>
  );
}
export default App