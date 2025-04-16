import React from 'react';
import Web3 from 'web3';
import Auction from './static/Auction.json';
import './App.css';
import NavBar from './components/NavBar';
import Auctions from './components/Auctions';
import Deeds from './components/Deeds';
import { Route, Routes } from 'react-router-dom';
import web3Service from './services/web3';

var myContract;
const App = () => {

  const [isConnected, setIsConnected] = React.useState(false);
  
  const [bidAmount, setBidAmount] = React.useState(null);

  const initWeb3 = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    console.log(await web3.eth.getAccounts());
    const networkId = await web3.eth.net.getId();

    myContract = await new web3.eth.Contract(
      Auction.abi,
      Auction.networks[networkId].address
    );

    console.log(await myContract.methods);
    console.log("highest bidder: ", await myContract.methods.getHighestBidder().call());
    console.log("highest bid: ", await myContract.methods.getHighestBidAmount().call());

  }

  // React.useEffect(() => {
  //   initWeb3();
  // }, []);

  async function placeBid() {

    if(typeof window.ethereum !== 'undefined') {
      console.log("MetaMask is installed!");
      
      if(window.ethereum.selectedAddress) {

        // console.log("set end time: ", await myContract.methods.endAuction(1744659957).call());
        console.log("place bid: ", await myContract.methods.placeBid().send({from: window.ethereum.selectedAddress, value: Web3.utils.toWei(bidAmount, 'ether')}));
        console.log("highest bidder: ", await myContract.methods.getHighestBidder().call());
        console.log("highest bid: ", await myContract.methods.getHighestBidAmount().call());
      }else {
        console.log(await window.ethereum.request({ method: 'eth_requestAccounts' }));
      }
    }else {
      console.log("MetaMask is not installed!");
    }

  }

  async function handleConnect() {
    if(!isConnected){
      await web3Service.init();
      const accounts = await web3Service.getAccounts();
      console.log(accounts);
      setIsConnected(true);
      console.log("Connected to Metamask");
    }
  }

  return (
    <>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Auctions />} />
        <Route path="/auction" element={<Auctions />} />
        <Route path="/deed" element={<Deeds />} />
      </Routes>
      <button class="connectBtn"
        onClick={handleConnect}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" fill="white"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path></svg>
        Connect
        </button>
        {/* <p>Place your bid</p>
        <img src="" alt="Auction Logo" />
        <input type="number" placeholder='Bid Amount' onChange={(e) => setBidAmount(e.target.value)} />
        <button className='btn' onClick={placeBid}>Place Bid</button> */}
      
      

    </>
  )
}

export default App