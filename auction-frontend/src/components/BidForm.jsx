import React from 'react'
import './styles/BidForm.css'
// import web3Service from '../services/blockchainService';


// var myContract = web3Service.myContract;

const BidForm = ({onClick}) => {

  const [bidAmount, setBidAmount] = React.useState('');

  const handleSubmit = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    onClick(bidAmount); 
    setBidAmount(''); 
  };

  return (
    <div>
      <div className="subscribe">
        <p>Place your bid</p>
        <input 
          placeholder="ETH" 
          className="subscribe-input" 
          name="eth" 
          type="number" 
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <br/>
        <div className="submit-btn" onClick={handleSubmit}>
          SUBMIT
        </div>
      </div>
    </div>
  )
}

export default BidForm