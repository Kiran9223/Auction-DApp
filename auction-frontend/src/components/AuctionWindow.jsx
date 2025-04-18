import React from 'react'
import './styles/AuctionWindow.css'
import car from '../assets/car.png'

const AuctionWindow = ({ open, OnClose }) => {
  if (!open) return null

  return (
    <div className="auction-window">
      <div className="auction-content-card">
        <button className="close-button" onClick={OnClose}>×</button>

        <div className="auction-chat-container">
          <h1>Auction</h1>

          <div className="auction-info">
            <div className="info-block">
              <h3>Starting Bid:</h3>
              <p>1 ETH</p>
            </div>
            <div className="info-block">
              <h3>Current Bid:</h3>
              <p>1.5 ETH</p>
            </div>
            <div className="info-block">
              <h3>Time Remaining:</h3>
              <p>02:30</p>
            </div>
          </div>

          <div className="auction-item">
            <h2>Car</h2>
            <img src={car} alt="Auction car" />
          </div>

          <div className="auction-price-list">
            {/* Bidding history can be added here */}
          </div>
        </div>

        <div className="bid-box">
          <label>Place your bid</label>
          <input type="text" placeholder="ETH" />
          <button>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default AuctionWindow
