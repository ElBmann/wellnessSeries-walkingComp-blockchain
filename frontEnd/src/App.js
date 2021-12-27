import React, { useEffect, useState, Component } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/walkCompetition.json';
//import { default as strava, Strava } from 'strava-v3';
import fetchMiles from './scripts/getStravaAPI';
import { Link } from 'react-router-dom';
const strava = require("strava-v3");
require('dotenv').config();
//Add Front End to Git. Please
const App = () => {
  const strava = require('strava-v3');
  const [allMiles, setAllMiles] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [stravaLink, setStravaLink] = useState("");
  const [stravaCode, setStravaCode] = useState("");
  const [bet, setBet] = useState("");
  let stravaCodefunction = "";
  let sMiles = "";
  const [stravaMiles, setStravaMiles] = useState("");

  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const contractABI = abi.abi;

  
  const getAllMiles = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);
        const walks = await WalkCompitionContract.getAllMiles();
        
        const milesCleaned = walks.map(walk => {
        
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

  const apiGet = async () => {

    strava.config({
      "access_token": process.env.ACCESS_TOKEN,
      "client_id": process.env.REACT_APP_CLIENT_ID,
      "client_secret": process.env.REACT_APP_CLIENT_SECRET,
      "redirect_uri": "http://localhost:3000/",
    });

    const authorizationCode = strava.oauth.getRequestAccessURL({ scope: "profile:write,profile:read_all,read_all,activity:read_all,activity:write" })


    setStravaLink(authorizationCode);


  }
  const apiGetStravaData = async () => {


    try {
      console.log('stravaCode: ' + stravaCodefunction);
      console.log('Calling Props: ' + currentAccount);
      if (stravaCodefunction) {
        const payload = await strava.oauth.getToken(stravaCodefunction);
        const athleteInfo = await strava.athlete.listActivities({ access_token: payload.access_token })
        const athleteStats = await strava.athlete.get({
          access_token: payload.access_token
        });
        console.log(athleteStats);
        sMiles = athleteInfo[0].distance;
        let fName = athleteStats.firstname;
        console.log(fName);
        //update the contract miles
      //  setStravaMiles(Math.round(athleteInfo[0].distance));
        //setMilesBC();
        //setStravaMiles(37);


      }
    } catch (error) {
      console.log(error);
    }

  }
 
  const placeTheBet = async () => {

    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("TEST 123 " + `${currentAccount}` );
    console.log("TEST 123 " + `${bet}` );
    let placeBet = await WalkCompitionContract.takeBet('0x66463431ce15129917eb63595ec6c7683f13bc09',{value: 1000000000000000});
     await placeBet.wait();

  }
 

  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted, ${bet}`);
    setBet("");
    placeTheBet();

  }
  const setMilesBC = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);
    
        const waveTxn = await WalkCompitionContract.mile(4);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

       let count = await WalkCompitionContract.getTotalMiles();
        console.log("retrieved total vibe count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const setAccessToken = async () => {

    console.log(window.location.href);
    var str = window.location.href.search(/code=/);
    var strScope = window.location.href.search(/&scope=/);
    if (str != -1) {
      console.log('str' + str);

      // stravaAToken  
      //setStravaAToken(window.location.href.substring(str+5, strScope));
      stravaCodefunction = window.location.href.substring(str + 5, strScope);
      setStravaCode(stravaCodefunction);
      // apiGetStravaData();
    }
  }

  useEffect(() => {
    //setMilesBC();
    checkIfWalletIsConnected();
    apiGet();
    setAccessToken();
    apiGetStravaData();

  }, [])
  //TODO: Add another function to grab the new code from url. Add it to react state
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          🚶‍♂️ Walking competitions!
        </div>

        <div className="bio">
          Connect your Ethereum wallet, Add your strava username, and pick your start and end date for the walking competition.
        </div>

        {!stravaCode && (<button className="waveButton" onClick={() => {

          window.open(stravaLink, "_blank");

        }}>
          Click to Connect With Strava 🤝
        </button>)}
        <div>
        {allMiles.map((walk, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {walk.address}</div>
              <div>Time: {walk.timestamp.toString()}</div>
              <div>WalkedMiles: {walk.walkedMiles}</div>
            </div>)
        })}
        </div>
        {currentAccount && (
          <form onSubmit={handleSubmit}>
            <input onChange={(e) => setBet(e.target.value)} value={bet}></input>
            <button className="waveButton">
              Place Bet ✨
            </button>
          </form>
        )}
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