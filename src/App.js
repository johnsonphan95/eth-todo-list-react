import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [block, setBlock] = useState(null);

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
    const web3 = await new Web3(web3Provider);
    await loadAccount(web3);
    await loadBlock(web3);
  }

  const loadAccount = async (web3) => {
    const accounts = await web3.eth.getAccounts(); 
    const address = accounts[0];
    const bal = await web3.eth.getBalance(accounts[0]);
    setAccount(accounts[0]);
    setBalance(web3.utils.fromWei(bal));
  }

  const loadBlock = async (web3) => {
    const data = await web3.eth.getBlock();
    setBlock(data.transactions); 
  }

  return (
    <div className="App">
    <h1>Hello World!</h1>
    <h1>address: {account}</h1> 
    <h1>balance: {balance}</h1>
    <ul>
      {block ? block.map((transaction, i) => (
        <li key={i}>
          {transaction}
        </li>
      )) : null}
    </ul>
    </div>
  );
}

export default App;
