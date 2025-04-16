import React from 'react'
import './styles/AuctionWindow.css'
import BidForm from './BidForm'
import car from '../assets/car.png'

const AuctionWindow = ({open, OnClose, children}) => {
  if (!open) return null
  return (
    <>
      <div className='auction-window'>
          <button className='close-button' onClick={OnClose}></button>
          <div className='auction-chat-container'>
            <div className='auction-chat-header'>
              <h1>Auction</h1>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '45px'}}>
                <h2>Starting Bid: </h2>
                <h2>Current Bid: </h2>
                <h2>Time Remaining: </h2>
              </div>
              <h2>Car</h2>
              <img src={car} style={{width: '200px', height: '100px'}}/>
            </div>
            <div className='auction-price-list'>
                
            </div>
          </div>
          <BidForm/>
    </div>
    </>
  )
}

export default AuctionWindow