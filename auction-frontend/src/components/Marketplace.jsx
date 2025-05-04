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
        NFTAuction.networks[5777].address,  
        NFTAuction.abi,
          signer
        );
  
        // 3. call your read-only getter to fetch all NFTs
        const rawTokens = await contract.getAllNFTs();
        
        // 4. hydrate each valid NFT
        const items = await Promise.all(
          rawTokens
            .filter(i => i.currentlyListed) // Only process tokens that are currently listed
            .map(async (i) => {
              try {
                // pull tokenURI, convert to HTTP URL, fetch metadata
                const tokenId = i.tokenId.toString();
                const uri = GetIpfsUrlFromPinata(await contract.tokenURI(tokenId));
                const { data: meta } = await axios.get(uri);
    
                return {
                  tokenId: tokenId,
                  seller: i.seller,
                  owner: i.owner,
                  price: ethers.formatEther(i.price), // BigNumber → string ETH
                  image: meta.image,
                  name: meta.name,
                  description: meta.description,
                };
              } catch (err) {
                console.error(`Error processing token ${i.tokenId}: ${err.message}`);
                return null; // Return null for failed tokens
              }
            })
        );
  
        // 5. filter out nulls and store in state
        setData(items.filter(item => item !== null));
        setDeedStatus('');
      } catch (err) {
        console.error('Failed to load NFTs:', err);
        setDeedStatus('❌ Failed to load NFTs');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    //Buy NFT function
    async function buyNFT(tokenId, price) {
        try {
            updateMessage("Buying the NFT... Please Wait");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
    
            // Pull the deployed contract instance
            let contract = new ethers.Contract(NFTAuction.networks[5777].address, NFTAuction.abi, signer);
            const salePrice = ethers.parseUnits(price, 'ether');
            

            console.log("Raw price from item:", price, typeof price);
            console.log("Parsed price:", salePrice, typeof salePrice);

            // Run the executeSale function
            let transaction = await contract.executeSale(tokenId, {value: salePrice});
            await transaction.wait();

            // try {
            //   // 1) Simulate the call
            //   await contract.executeSale.staticCall(tokenId, {value: salePrice});
            // } catch (simErr) {
            //   // callStatic will bubble up the actual `require(...)` message
            //   console.error("callStatic error object:", simErr);

            //   // ethers v6 puts the human‑readable reason in one of these…
            //   const reason =
            //     // this is set when you do `require(..., "Foo")`
            //     simErr.reason
            //     // v6 also surfaces a “shortMessage” containing that same text
            //     ?? simErr.shortMessage
            //     // some nodes drop both, but leave raw error data here
            //     ?? simErr.data
            //     // fallback to the generic JS error message
            //     ?? simErr.message;

            //   alert(`Cannot claim NFT: ${reason}`);
            //   return;
            // }
    
            alert('You successfully bought the NFT!');
            updateMessage("");
            
            // Refresh the NFT list to show the updated ownership
            fetchAllNFTs();
        }
        catch(e) {
            console.error("Error buying NFT:", e);
            alert("Error buying NFT: " + e.message);
            updateMessage("");
        }
    }
  
  return (
    <>
        <button onClick={fetchAllNFTs} className="refresh-button">Refresh</button>
        {/* <h2>{deedStatus}</h2> */}
        <h2>{buyMessage}</h2>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
            <div>
                {/* {deedStatus && <p>{deedStatus}</p>} */}

                {loading ? (
                  <p>Loading NFTs...</p>
                ) : data.length === 0 ? (
                  <p>No NFTs found. Try minting some first!</p>
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
                          <strong>Price:</strong> {item.price} ETH
                        </p>
                        {currAddress.toLowerCase() === item.seller.toLowerCase() ? (
                          <p>You are the seller</p>
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