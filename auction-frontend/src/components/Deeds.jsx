import React from 'react'
import DeedCard from './DeedCard'
import MintButton from './MintButton'
import './styles/Deeds.css'

const Deeds = () => {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [price, setPrice] = React.useState('')

  function handleMint(){
    console.log(name, description, price)
    // Add minting logic here

    clearFields();
  }

  function clearFields(){
    setName('')
    setDescription('')
    setPrice('')
  }


  return (
    <>
    <div className='auction-container'>
        <h1>Deeds</h1>
        <div className='mint-button-container'>
            <h2>Add an NFT 😎</h2>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '75px'}}>
              <form class="form">
                <span class="input-span">
                  <label for="name" class="label">Name</label>
                  <input type="name" name="name" id="name"
                  onChange={(e) => setName(e.target.value)} value={name}
                /></span>
                <span class="input-span">
                  <label for="description" class="label">Description</label>
                  <input type="description" name="description" id="description"
                  onChange={(e) => setDescription(e.target.value)} value={description}
                /></span>
                <span class="input-span">
                  <label for="price" class="label">Price (ETH)</label>
                  <input type="number" name="price" id="price"
                  onChange={(e) => setPrice(e.target.value)} value={price}
                /></span>
              </form>
              <MintButton onClick={handleMint}/>
            </div>
        </div>
        <h2>My Deeds</h2>
        <div className='card-container'>
          <DeedCard />
          <DeedCard />
          <DeedCard />
          <DeedCard />
        </div>
        
      </div>
    </>
  )
}

export default Deeds