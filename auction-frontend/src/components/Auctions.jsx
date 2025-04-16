import React from 'react'
import AuctionCard from './AuctionCard'

const Auctions = () => {
  return (
    <>
    <div className='auction-container'>
        <h1>Auctions</h1> 
        <div className='card-container'>
          <AuctionCard/>
          <AuctionCard/>
          <AuctionCard/>
          <AuctionCard/>
        </div>
      </div>
    </>
  )
}

export default Auctions