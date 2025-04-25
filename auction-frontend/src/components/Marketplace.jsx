import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTAuction from '../abis/NFTAuction.json'
import axios from 'axios';
import './styles/Marketplace.css'


const GetIpfsUrlFromPinata = (pinataUrl) => {
    var IPFSUrl = pinataUrl.split("/");
    const lastIndex = IPFSUrl.length;
    IPFSUrl = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
    return IPFSUrl;
};

export const Marketplace = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deedStatus, setDeedStatus] = useState('');
    const [currAddress, updateCurrAddress] = useState("0x");
    const [buyMessage, updateMessage] = useState("");

    useEffect(() => {
      // run once on mount
      fetchAllNFTs();
    }, []);
  
    async function fetchAllNFTs() {
      try {
        setDeedStatus('⏳ Requesting wallet access...');
        // 1. connect to MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await provider.send('eth_requestAccounts', []);
        updateCurrAddress(await signer.getAddress());
  
        setDeedStatus('⏳ Fetching NFTs from contract…');
        // 2. instantiate contract with a provider (for read-only calls)
        const contract = new ethers.Contract(
        //   CONTRACT_ADDRESS,
        NFTAuction.networks[5777].address,  
        NFTAuction.abi,
          signer
        );
  
        // 3. call your read-only getter
        const raw = await contract.getAllNFTs();
  
        // 4. hydrate each NFT
        const items = await Promise.all(
          raw.map(async (i) => {
            // pull tokenURI, convert to HTTP URL, fetch metadata
            const uri = GetIpfsUrlFromPinata(await contract.tokenURI(i.tokenId));
            const { data: meta } = await axios.get(uri);
  
            return {
              tokenId: i.tokenId.toString(),  // BigInt → string
              seller: i.seller,
              owner: i.owner,
              price: ethers.formatEther(i.price), // BigNumber → string ETH
              image: meta.image,
              name:  meta.name,
              description: meta.description,
            };
          })
        );
  
        // 5. store in state
        setData(items);
        setDeedStatus('');
      } catch (err) {
        console.error(err);
        setDeedStatus('❌ Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    }

    //Buy NFT function
    async function buyNFT(tokenId, price) {
        try {
            // const ethers = require("ethers");
            // //After adding your Hardhat network to your metamask, this code will get providers and signers
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner();

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            // await provider.send('eth_requestAccounts', []);
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(NFTAuction.networks[5777].address, NFTAuction.abi, signer);
            const salePrice = ethers.parseUnits(price, 'ether');
            updateMessage("Buying the NFT... Please Wait")
            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, {value:salePrice});
            await transaction.wait();
    
            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch(e) {
            alert("Upload Error"+e)
        }

    }
  
  return (
    <>
        {/* <button onClick={fetchAllNFTs} className="refresh-button">Refresh</button> */}
        <h2>{deedStatus}</h2>
        <h2>{buyMessage}</h2>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
            <div>
                {deedStatus && <p>{deedStatus}</p>}

                {data.length === 0 ? (
                  <p>No NFTs found.</p>
                ) : (
                  <div className="nft-list">
                    {data.map((item) => (
                      <div className="nft-card" key={item.tokenId}>
                        <img src={item.image} alt={item.name} style={{width:'200px', height:'200px', objectFit:'contain'}} />

                        <h2>{item.name}</h2>
                        <p>{item.description}</p>

                        <p>
                          <strong>Owner:</strong> {item.owner}
                        </p>
                        <p>
                          <strong>Seller:</strong> {item.seller}
                        </p>
                        <p>
                          <strong>Price:</strong> {item.price} ETH
                        </p>
                        {currAddress === item.seller ? (
                          <p>You are the owner</p>
                        ) : (
                          <button className="btn" onClick={() => buyNFT(item.tokenId, item.price)}>Buy Now</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
    </>
  )
}
