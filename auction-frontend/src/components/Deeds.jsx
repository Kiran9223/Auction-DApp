import React from 'react'
import MintButton from './MintButton'
import './styles/Deeds.css'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata';
import NFTAuction from '../abis/NFTAuction.json'
import axios from 'axios';

const GetIpfsUrlFromPinata = (pinataUrl) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  // IPFSUrl = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
  IPFSUrl = "https://gateway.pinata.cloud/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};

const Deeds = () => {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [status, setStatus] = useState('')
  const [fileURL, setFileURL] = useState(null)
  const [deedsStatus, setDeedsStatus] = useState('No deeds yet')


  async function OnChangeFile(e) {
    var file = e.target.files[0];

    try {
      const response = await uploadFileToIPFS(file);
      if(response.success === true) {
        console.log("File uploaded to IPFS: ", response.pinataURL);
        setFileURL(response.pinataURL);
        setStatus("File uploaded to IPFS successfully!", response.pinataURL);
      }
    } catch(e) {
      console.log("Error uploading file to IPFS: ", e);
      setStatus("Error uploading file to IPFS: ", e.message);
    }
  }

  async function uploadMetaDataToIPFS() {
    if(!name || !description || !price || !fileURL) {
      return;
    }

    const nftJSON = {
      name: name,
      description: description,
      price: price,
      image: fileURL
    }

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if(response.success === true) {
        console.log("Metadata uploaded to IPFS: ", response);
        setStatus("Metadata uploaded to IPFS successfully!", response.pinataURL);
        return response.pinataURL;
      }

    } catch(e) {
      console.log("Error uploading metadata to IPFS: ", e);
      // setStatus("Error uploading metadata to IPFS: ", e.message);
    }


  }

  async function listNFT(e) {
    e.preventDefault();

    try {
      if(!name || !description || !price || !fileURL) {
        alert("Please fill all the fields!");
        return;
      }
      if(price <= 0) {
        alert("Price should be greater than 0!");
        return;
      }
      const metadataURL = await uploadMetaDataToIPFS();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Provider: ", provider);
      console.log("Signer: ", signer);
      console.log("Metadata URL: ", metadataURL);
      

      setStatus("Please while... Uploading(may take up to 5 mins) NFT to IPFS...");

      let contract = new ethers.Contract(
        NFTAuction.networks[5777].address,
        NFTAuction.abi,
        signer
      );

      const priceL = ethers.parseEther(price.toString())
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      let transaction = await contract.createToken(metadataURL, priceL, {value: listingPrice});
      await transaction.wait();

      setStatus("NFT Listed Successfully!");
      setName('');
      setDescription('');
      setPrice(0);
      setFileURL(null);
      
      alert("NFT Listed Successfully!");
      // refresh the page
      window.location.reload();
    } catch(e) {
      // alert("Error uploading file to IPFS: ", e);
      console.log("Error minting the token: ", e);
    }  
  } 


  //***************************************//
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deedStatus, setDeedStatus] = useState('');
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

      setDeedStatus('⏳ Fetching NFTs from contract…');
      // 2. instantiate contract with a provider (for read-only calls)
      const contract = new ethers.Contract(
        NFTAuction.networks[5777].address,
        NFTAuction.abi,
        signer
      );

      // 3. call your read-only getter
      const raw = await contract.getMyNFTs(false);

      const realRaw = raw.filter(i => i.tokenId.toString() !== "0");

      // 4. hydrate each NFT
      const items = await Promise.all(
        
        realRaw.map(async (i) => {
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

  
  return (
    <>
      <div className='auction-container'>
        <h1>Mint a Deed</h1>
        <h2>{status}</h2>
  
        <div className="mint-section">
          {/* LEFT: Form Box */}
          <div className="form-container">
            <h2 className="mint-heading">Add an NFT</h2>
            <form className="form" onSubmit={listNFT}>
              <span className="input-span">
                <label htmlFor="name" className="label">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </span>
  
              <span className="input-span">
                <label htmlFor="description" className="label">Description</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </span>
  
              <span className="input-span">
                <label htmlFor="price" className="label">Price (ETH)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
              </span>
  
              <span className="input-span">
                <label htmlFor="image" className="label">Image</label>
                <input type="file" id="image" onChange={OnChangeFile} />
              </span>
            </form>
          </div>
  
          {/* RIGHT: Mint Button Centered */}
          <div className="mint-button-side">
            <MintButton onClick={listNFT} />
          </div>
        </div>
  
        {/* 📌 Status Section */}
        <div className="status-section">
          <h2>My Deeds</h2>
          {/* {deedStatus && <p className="error">❌ {deedStatus}</p>}
          {data.length === 0 && !loading && <p className="subtext">No Deeds yet.</p>} */}

        {/* <button onClick={fetchAllNFTs} className="refresh-button">Refresh</button> */}
        {/* <h2>{deedsStatus}</h2> */}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

        </div>
  
      </div>
    </>
  )
}
export default Deeds;