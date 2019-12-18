import React from 'react';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [block, setBlock] = useState(null);

  useEffect(() => {
    loadBlockchainData()
  }, [account, balance])

  const loadBlockchainData = async () => {
    console.log('called')
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
    if (account) {
      const wei = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(wei));
    }
    const data = await web3.eth.getBlock();
    setBlock(data.transactions); 
    
  }

  return (
    <div className="App">
    <h1>Hello World!</h1>
    <h1>address: {account}</h1> 
    <h1>balance: {balance}</h1>
    <ul>
      {block ? block.map((transaction) => (
        <li>
          {transaction}
        </li>
      )) : null}
    </ul>
    </div>
  );
}

export default App;
