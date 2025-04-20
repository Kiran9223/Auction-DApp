import React from 'react'
import './styles/AuctionWindow.css'
import BidForm from './BidForm'
// import car from '../assets/car1.png'
// import Auction from '../static/Auction.json';
// import web3Service from '../services/blockchainService';

// var myContract = web3Service.myContract;
const AuctionWindow = ({open, OnClose, children}) => {
  if (!open) return null

  const [bidAmount, setBidAmount] = React.useState(0);
  const [highestBid, setHighestBid] = React.useState(0);

  


  async function placeBid() {
    
  }
  
  return (
    <>
      <div className='auction-window'>
          <button className='close-button' onClick={OnClose}></button>
          <div className='auction-chat-container'>
            <div className='auction-chat-header'>
              <h1>Auction</h1>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '45px'}}>
                <h2>Starting Bid: </h2>
                <h2>Highest Bid: {highestBid}</h2>
                <h2>Time Remaining: </h2>
              </div>
              <h2>Car</h2>
              {/* <img src="" style={{width: '200px', height: '100px'}}/> */}
            </div>
            <div className='auction-price-list'>
                
            </div>
          </div>
          <BidForm onClick={placeBid}/>
    </div>
    </>
  )
}

export default AuctionWindow