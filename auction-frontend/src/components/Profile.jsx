import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import NFTAuction from '../abis/NFTAuction.json';
import { getProvider } from '../services/blockchainService';
import './styles/Profile.css';

const GetIpfsUrlFromPinata = (pinataUrl) => {
  const parts = pinataUrl.split('/');
  return `https://ipfs.io/ipfs/${parts[parts.length - 1]}`;
};

export default function Profile() {
  const [data, setData] = useState([]);
  const [addr, setAddr] = useState('');          // <-- start as empty string
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getNFTData();
  }, []);

  async function getNFTData() {
    try {
      const provider = await getProvider();

      // 1) get your signer and address
      const signer  = await provider.getSigner();
      const address = await signer.getAddress();
      setAddr(address);                           // <-- now a string

      // 2) instantiate your contract (using provider or signer; read‑only OK)
      const contract = new ethers.Contract(
        NFTAuction.networks[5777].address,
        NFTAuction.abi,
        signer
      );

      // 3) fetch user’s NFTs
      const raw = await contract.getMyNFTs();

      // 4) hydrate them
      let sum = 0;
      const items = await Promise.all(
        raw.map(async (i) => {
          const uri  = GetIpfsUrlFromPinata(await contract.tokenURI(i.tokenId));
          const { data: meta } = await axios.get(uri);

          const price = ethers.formatEther(i.price);
          sum += Number(price);

          return {
            price,
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
        })
      );

      setData(items);
      setTotalPrice(sum);
    } catch (err) {
      console.error('Failed to load NFTs:', err);
    }
  }

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Profile</h1>
      <div className="profile-stats">
        <p><strong>Wallet Address:</strong> {addr || 'Not connected'}</p>
        <p><strong>No. of NFTs:</strong> {data.length}</p>
        <p><strong>Total Value:</strong> {totalPrice} ETH</p>
      </div>

      <h2 className="profile-subheading">My NFTs</h2>
      {data.length === 0 ? (
        <p className="no-nfts">No NFTs found.</p>
      ) : (
        <div className="nft-grid">
          {data.map((item) => (
            <div className="nft-card" key={item.tokenId}>
              <img src={item.image} alt={item.name} />
              <div className="nft-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>Owner:</strong> {item.owner}</p>
                <p><strong>Price:</strong> {item.price} ETH</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
