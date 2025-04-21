import React from 'react'
import AuctionCard from './AuctionCard'

const Auctions = () => {
  
  return (
    <>
      <div className='auction-container'>
        <h1>Upcoming Auctions</h1> 
        <div className='card-container'>
          <AuctionCard/>
        </div>
      </div>
      <div className='auction-container'>
        <h1>Ongoing Auctions</h1> 
        <div className='card-container'>
        </div>
      </div>
      <div className='auction-container'>
        <h1>Past Auctions</h1> 
        <div className='card-container'>
        </div>
      </div>
    </>
  )
}

export default Auctions