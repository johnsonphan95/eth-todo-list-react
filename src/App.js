import React from 'react';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {

  const [account, setAccount] = useState("");

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    let web3Provider;
    if (window.ethereum) {
      web3Provider = window.ethereum;
      try { 
        await window.ethereum.enable();
      } catch (error) {
          console.log('User denied account access')
      }
    } 
    else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    }
    else {
      web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    const web3 = new Web3(web3Provider);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  return (
    <div className="App">
    <h1>Hello World!</h1>
    {account}
    </div>
  );
}

export default App;
