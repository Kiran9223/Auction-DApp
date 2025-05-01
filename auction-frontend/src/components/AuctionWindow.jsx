import React, {useEffect, useState} from 'react';
import './styles/AuctionWindow.css';
import BidForm from './BidForm';
import AuctionABI from '../abis/Auction.json';
import { ethers } from 'ethers';

const AuctionWindow = ({ open, OnClose, deedData }) => {
  if (!open || !deedData) return null;

  const { name, image, price, startingPrice, timer, tokenId } = deedData;

  const [startingBid, setStartingBid] = useState(startingPrice || 0);
  const [highestBid, setHighestBid] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState(timer || 0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);

  const fetchAuctionData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = AuctionABI.networks["5777"].address;
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);

      const auction = await contract.getAuction(tokenId);

      setStartingBid(ethers.formatEther(auction.startingPrice));
      setHighestBid(ethers.formatEther(auction.highestBid));

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const remaining = auction.endTime - currentTimestamp;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setAuctionEnded(true);
      } else {
        setTimeRemaining(remaining);
        setAuctionEnded(false);
      }
      const bids = await contract.getBids(tokenId);
      const parsedBids = bids.map(b => ({
        bidder: b.bidder,
        amount: ethers.formatEther(b.amount)
      }));
  
      setBidHistory(parsedBids);
  
    } catch (err) {
      console.error("Error fetching auction data", err);
    }
  };


  
  useEffect(() => {
    if (!tokenId) return;

    fetchAuctionData();
    const interval = setInterval(() => {
      fetchAuctionData();
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenId]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Auction Ended";
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const placeBid = async (bidAmount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = AuctionABI.networks["5777"].address;
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, signer);

      const tx = await contract.placeBid(tokenId, {
        value: ethers.parseEther(bidAmount)
      });

      await tx.wait();
      alert("Bid placed successfully!");

      fetchAuctionData();

    } catch (err) {
      console.error("Bid failed", err);
      alert("Bid failed: " + err.message);
    }
  };

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
        <h3>Bidding History</h3>
        {bidHistory.length === 0 ? (
        <p>No bids yet</p>
        ) : (
        bidHistory.map((bid, index) => (
      <p key={index}><strong>{bid.bidder}</strong>: {bid.amount} ETH</p>
           ))
        )}
        </div>

        <div className="bid-form-wrapper">
          {auctionEnded ? (
            <p style={{ fontWeight: "bold", color: "red" }}>Auction has ended</p>
          ) : (
            <BidForm onClick={placeBid} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionWindow;
