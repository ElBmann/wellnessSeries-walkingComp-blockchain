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
  let stravaCodefunction = "";
  let sMiles = "";
  const [stravaMiles, setStravaMiles] = useState("");

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

        const milesCleaned = walks.map(walk => {
          console.log("walk.walkedMiles " + walk.walkedMiles);
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
        console.log(athleteInfo[0].distance);
        sMiles = athleteInfo[0].distance;
        setStravaMiles(Math.round(athleteInfo[0].distance));
        setMilesBC(Math.round(athleteInfo[0].distance));
        //setStravaMiles(37);


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

  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted, ${name}`);
    setName("");

  }
  const setMilesBC = async (number) => {
    try {

      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WalkCompitionContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await WalkCompitionContract.getTotalmiles();
        console.log("Retrieved total vibe count...", count);
       console.log(number);
        const waveTxn = await WalkCompitionContract.mile(number);
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
    checkIfWalletIsConnected();
    apiGet();
    setAccessToken();

    apiGetStravaData();
    // if (stravaCodefunction) {
    //   console.log('WE IN HERE')
    //   setMilesBC();
    // }

  }, [])
  //TODO: Add another function to grab the new code from url. Add it to react state
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          🚶‍♂️ Walking competitions!
        </div>

        <div className="bio">
          Connect your Ethereum wallet and wave at me, Add your strava username, and pick your start and end date for the walking competition.
        </div>

        {!stravaCode && (<button className="waveButton" onClick={() => {

          window.open(stravaLink, "_blank");

          // apiGet();
          //setAccessToken();

        }}>
          Click to Connect With Strava 🤝
        </button>)}




        {allMiles.map((walk, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {walk.address}</div>
              <div>Time: {walk.timestamp.toString()}</div>
              <div>WalkedMiles: {walk.walkedMiles}</div>
            </div>)
        })}
        <div>

        </div>
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