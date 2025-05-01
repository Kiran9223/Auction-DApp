import React, {useState} from 'react'
import './styles/AuctionCard.css'
import car from '../assets/car1.png'
import AuctionWindow from './AuctionWindow'

const AuctionCard = ({ name, description, image, price,timer, tokenId, buttonType, onButtonClick, startingPrice }) => {

  const [isOpen, setIsOpen] = React.useState(false) 
  const [startingPriceInput, setStartingPriceInput] = useState('');
  const [timerInput, setTimerInput] = useState('');

  const deedData = { tokenId, name, image, startingPrice: price, timer }
  
  const handleClick = () => {
    if (buttonType === "start") {

      if (!startingPriceInput || !timerInput) {
        alert("Please enter starting price and auction timer.");
        return;
      }

      onButtonClick(tokenId, startingPriceInput, timerInput);

    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
    <div className="card">
      <div className="card__content">
        <div className="card__content-heading">
          <h2>{name}</h2>
        </div>
        <div className="card__content-body">\
          <img src={image} alt={name}/>
          <p>{description}</p>
        </div>
        <div className="card__content-footer">
            <p><strong>Price: {price} ETH</strong></p>

            {buttonType === "start" && (
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="number"
                  placeholder="Starting Price (ETH)"
                  value={startingPriceInput}
                  onChange={(e) => setStartingPriceInput(e.target.value)}
                  style={{ display: 'block', marginBottom: '5px' }}
                />
                <input
                  type="number"
                  placeholder="Timer (seconds)"
                  value={timerInput}
                  onChange={(e) => setTimerInput(e.target.value)}
                  style={{ display: 'block', marginBottom: '10px' }}
                />
              </div>
            )}

            <button className="participate-btn" onClick={handleClick}>
              {buttonType === "start" ? "Start" : "Participate"}
            </button>
          </div>
        </div>
      </div>
    {buttonType === "participate" && (
        <AuctionWindow open={isOpen} OnClose={() => setIsOpen(false)} deedData={deedData} />
      )}    
      </>
  )
}

export default AuctionCard