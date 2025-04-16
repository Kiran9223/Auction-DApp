import React from 'react'
import './styles/AuctionCard.css'
import car from '../assets/car.png'
import AuctionWindow from './AuctionWindow'

const AuctionCard = () => {
  const [isOpen, setIsOpen] = React.useState(false)  
  return (
    <>
    <div class="card">
      <div class="card__content">
        <div class="card__content-heading">
          <h2>Deed Name</h2>
        </div>
        <div class="card__content-body">\
          <img src={car}/>
          <p>Current Bid</p>
        </div>
        <div class="card__content-footer">
          <button className='participate-btn' onClick={() => setIsOpen(true)}>Participate</button>
        </div>
      </div>
    </div>
    <AuctionWindow open={isOpen} OnClose={() => setIsOpen(false)}/>
    </>
  )
}

export default AuctionCard