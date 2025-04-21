import React from 'react';
import './styles/AuctionWindow.css';
import BidForm from './BidForm';
import car from '../assets/car1.png'; // make sure this is a valid path

const AuctionWindow = ({ open, OnClose }) => {
  if (!open) return null;

  const [highestBid, setHighestBid] = React.useState(1.5);
  const [startingBid] = React.useState(1);
  const [timeRemaining] = React.useState("02:30");

  async function placeBid() {
    // your logic here
  }

  return (
    <div className="modal-overlay">
      <div className="auction-window">
        <button className="close-button" onClick={OnClose}>✕</button>

        <h1 className="auction-title">Auction</h1>

        <div className="auction-info-bar">
          <p><strong>Starting Bid:</strong> {startingBid} ETH</p>
          <p><strong>Current Bid:</strong> {highestBid} ETH</p>
          <p><strong>Time Remaining:</strong> {timeRemaining}</p>
        </div>

        <h2 className="item-title">Car</h2>
        <img src={car} alt="Car" className="auction-image" />

        <div className="auction-price-list">
          {/* future: bidding history */}
        </div>

        <div className="bid-form-wrapper">
          <BidForm onClick={placeBid} />
        </div>
      </div>
    </div>
  );
};

export default AuctionWindow;
