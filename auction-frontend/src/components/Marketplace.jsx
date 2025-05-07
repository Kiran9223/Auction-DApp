import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import NFTAuction from '../abis/NFTAuction.json'
import axios from 'axios';
import './styles/Marketplace.css'
import ReactCanvasConfetti from 'react-canvas-confetti';

const GetIpfsUrlFromPinata = (pinataUrl) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  // IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];

  IPFSUrl = "https://gateway.pinata.cloud/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};

// const GetIpfsUrlFromPinata = (pinataUrl) => {
//   // Extract the CID (Content Identifier) from the Pinata URL
//   const IPFSUrl = pinataUrl.split("/");
//   const lastIndex = IPFSUrl.length;
//   const cid = IPFSUrl[lastIndex - 1];
  
//   return cid; // Just return the CID for use with the fetchFromIpfs function
// };

// // Function to fetch from IPFS with automatic gateway fallback
// const fetchFromIpfs = async (cid) => {
//   const gateways = [
//     "https://cloudflare-ipfs.com/ipfs/",
//     "https://gateway.pinata.cloud/ipfs/",
//     "https://dweb.link/ipfs/",
//     "https://ipfs.filebase.io/ipfs/"
//   ];
  
//   let lastError = null;
  
//   for (const gateway of gateways) {
//     try {
//       const response = await fetch(`${gateway}${cid}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//         timeout: 5000 // 5 second timeout
//       });
      
//       if (response.ok) {
//         return await response.json(); // or .text() depending on content type
//       }
//     } catch (error) {
//       console.log(`Failed to fetch from ${gateway}: ${error.message}`);
//       lastError = error;
//     }
//   }
  
//   throw new Error(`Failed to fetch from all IPFS gateways: ${lastError?.message}`);
// };

// // Usage example
// const getData = async (pinataUrl) => {
//   const cid = GetIpfsUrlFromPinata(pinataUrl);
//   try {
//     const data = await fetchFromIpfs(cid);
//     return data;
//   } catch (error) {
//     console.error("Error fetching IPFS data:", error);
//     // Handle error appropriately
//   }
// };

export const Marketplace = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deedStatus, setDeedStatus] = useState('');
  const [currAddress, updateCurrAddress] = useState("0x");
  const [buyMessage, updateMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const confettiInstance = useRef(null);

  useEffect(() => {
    // run once on mount
    fetchAllNFTs();
  }, []);

  const fireConfetti = () => {
    if (confettiInstance.current) {
      confettiInstance.current({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      confettiInstance.current({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.3 }
      });
    }
  };

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

      const listedToken = await contract.getListedTokenForId(tokenId);
      console.log("Listed token:", listedToken);

      // Run the executeSale function
      let transaction = await contract.executeSale(tokenId, { value: salePrice });
      await transaction.wait();

      // listing fee is 0.01 ETH
      // const listingFee = ethers.parseUnits("0.01", 'ether');

      // try {
      //   // 1) Simulate the call
      //   await contract.executeSale.staticCall(tokenId, {value: salePrice+listingFee});
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

      document.getElementById('success-sound').play();

      fireConfetti();

      // Show popup
      setPopupMessage("🎉 Congratulations! You successfully bought the NFT!");
      setShowPopup(true);

      // Hide popup after 5 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      updateMessage("");

      // Refresh the NFT list to show the updated ownership
      fetchAllNFTs();
    }
    catch (e) {
      console.error("Error buying NFT:", e);
      alert("Error buying NFT: " + e.message);
      updateMessage("");
    }
  }

  return (
    <>
      {/* <h2>{deedStatus}</h2> */}
      <h2>{buyMessage}</h2>
      <audio id="success-sound" src="/sounds/success.mp3" preload="auto"></audio>
      {showPopup && (
        <div className="popup-message">
          <p>{popupMessage}</p>
        </div>
      )}
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
                  <img src={item.image} alt={item.name} style={{ width: '200px', height: '200px', objectFit: 'contain' }} />

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
      <ReactCanvasConfetti
        style={{ position: 'fixed', pointerEvents: 'none', width: '100%', height: '100%', top: 0, left: 0 }}
        onInit={({ confetti }) => {
          confettiInstance.current = confetti;
        }}
      />
    </>
  )
}