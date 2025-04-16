import React from 'react'
import './styles/BidForm.css'

const BidForm = () => {
  return (
    <div>
        <div class="subscribe">
            <p>Place your bid</p>
            <input placeholder="ETH" class="subscribe-input" name="eth" type="number" />
            <br/>
            <div class="submit-btn">SUBMIT</div>
        </div>
    </div>
  )
}

export default BidForm