import React, {useState, useEffect, useReducer} from 'react';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config';
import Web3 from 'web3';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [block, setBlock] = useState(0);
  const [todoList, setTodoList] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

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
    await loadTodoList(web3);
  }

  const loadAccount = async (web3) => {
    const accounts = await web3.eth.getAccounts(); 
    const address = accounts[0];
    const bal = await web3.eth.getBalance(address);
    setAccount(address);
    setBalance(web3.utils.fromWei(bal));
  }

  const loadBlock = async (web3) => {
    const _block = await web3.eth.getBlock();
    setBlock(_block.transactions); 
  }

  const loadTodoList = async (web3) => {
    const _todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    setTodoList(_todoList);
    const _taskCount = await _todoList.methods.taskCount().call();
    setTaskCount(_taskCount);
  }

  return (
    <div className="App">
    <h1>Hello World!</h1>
    <h1>address: {account}</h1> 
    <h1>balance: {balance}</h1>
  <h1>Task Count: {taskCount}</h1>
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
