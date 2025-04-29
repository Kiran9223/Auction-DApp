import React from 'react'
import './styles/AuctionCard.css'
import car from '../assets/car1.png'
import AuctionWindow from './AuctionWindow'

const AuctionCard = ({ name, description, image, price, tokenId, buttonType, onButtonClick }) => {
  const [isOpen, setIsOpen] = React.useState(false) 

  const deedData = { name, image, price }
  
  const handleClick = () => {
    if (buttonType === "start") {
      onButtonClick(); 
    } else {
      setIsOpen(true); 
    }
  }

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
          <button className='participate-btn' onClick={handleClick}>
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