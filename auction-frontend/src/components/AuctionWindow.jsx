import React, {useEffect, useState} from 'react';
import './styles/AuctionWindow.css';
import BidForm from './BidForm';
import car from '../assets/car1.png'; // make sure this is a valid path

const AuctionWindow = ({ open, OnClose, deedData }) => {
  if (!open || !deedData) return null;

  const { name, image, price } = deedData;

  const [highestBid, setHighestBid] = React.useState(0);
  const [startingBid] = React.useState(price);
  const [timeRemaining, setTimeRemaining] = React.useState(60);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

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
          <p><strong>Time Remaining:</strong> {formatTime(timeRemaining)}</p>
        </div>

        <h2 className="item-title">{name}</h2>
        <img src={image} alt={name} className="auction-image" />

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
