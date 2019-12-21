import React, {useState, useEffect} from 'react';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config';
import TodoList from './TodoList';
import Web3 from 'web3';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [block, setBlock] = useState(0);
  const [todoList, setTodoList] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadBlockchainData()
  }, [taskCount])

  const loadBlockchainData = async () => {
    console.log('loaded')
    let web3Provider;
    setIsLoading(true)
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
    setIsLoading(false)
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
    // const task = await _todoList.methods.tasks(1).call()
    // console.log(task)
    const _tasks = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      _tasks.push(task)
    }
    setTasks(_tasks)
  }

  const createTask = (content) => {
    setIsLoading(true);
    todoList.methods.createTask(content).send({from: account})
    .once('receipt', (receipt) => {
      setIsLoading(false)
    })
  }

  return (
    <div className="App">
      <h1>Hello World!</h1>
      <h1>address: {account}</h1> 
      <h1>balance: {balance}</h1>
      <h1>Task Count: {taskCount}</h1>
      <TodoList tasks={tasks} createTask={createTask} />
    </div>
  );
}

export default App;
