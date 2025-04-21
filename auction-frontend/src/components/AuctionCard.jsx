import React from 'react'
import './styles/AuctionCard.css'
import car from '../assets/car1.png'
import AuctionWindow from './AuctionWindow'

const AuctionCard = () => {
  const [isOpen, setIsOpen] = React.useState(false)  
  return (
    <>
    <div className="card">
      <div className="card__content">
        <div className="card__content-heading">
          <h2>Deed Name</h2>
        </div>
        <div className="card__content-body">\
          <img src={car}/>
          <p>Coming Soon...</p>
        </div>
        <div className="card__content-footer">
          <button className='participate-btn' onClick={() => setIsOpen(true)}>Participate</button>
        </div>
      </div>
    </div>
    <AuctionWindow open={isOpen} OnClose={() => setIsOpen(false)}/>
    </>
  )
}

export default AuctionCard