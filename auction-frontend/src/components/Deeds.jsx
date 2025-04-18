import React from 'react'
import DeedCard from './DeedCard'
import MintButton from './MintButton'
import './styles/Deeds.css'

const Deeds = () => {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [price, setPrice] = React.useState('')

  function handleMint() {
    console.log(name, description, price)
    // Add minting logic here
    clearFields()
  }

  function clearFields() {
    setName('')
    setDescription('')
    setPrice('')
  }

  return (
    <div className="deed-page">
      <h1 className="page-title">Deeds</h1>
      <h2 className="sub-title">Add an NFT</h2>

      <div className="form-mint-section">
        <form className="form">
          <span className="input-span">
            <label htmlFor="name" className="label">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </span>
          <span className="input-span">
            <label htmlFor="description" className="label">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </span>
          <span className="input-span">
            <label htmlFor="price" className="label">Price (ETH)</label>
            <input
              type="number"
              name="price"
              id="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </span>
        </form>
        <MintButton onClick={handleMint} />
      </div>

      <h2 className="section-title">My Deeds</h2>
      <div className="card-container">
        <DeedCard />
        <DeedCard />
        <DeedCard />
        <DeedCard />
      </div>
    </div>
  )
}

export default Deeds
