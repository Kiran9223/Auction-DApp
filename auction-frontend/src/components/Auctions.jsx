import React, {useState, useEffect} from 'react'
import AuctionCard from './AuctionCard'
import {ethers} from 'ethers';
import NFTAuction from '../abis/NFTAuction.json'

const Auctions = () => {
  const [deeds, setDeeds] = useState([]);

  const fetchDeeds = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = NFTAuction.networks["5777"].address;
      const contract = new ethers.Contract(contractAddress, NFTAuction.abi, signer);

      const rawDeeds = await contract.getMyNFTs();

      const deedsData = await Promise.all(
        rawDeeds.map(async (deed) => {
          const uri = await contract.tokenURI(deed.tokenId);
          const response = await fetch(`https://ipfs.io/ipfs/${uri.split('/').pop()}`);
          const metadata = await response.json();

          return {
            tokenId: deed.tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            price: ethers.formatEther(deed.price),
            auctionStatus: "upcoming"
          };
        })
      );

      setDeeds(deedsData);
    } catch (err) {
      console.error("Error loading deeds:", err);
    }
  };

  useEffect(() => {
    fetchDeeds();
  }, []);

  const upcomingDeeds = deeds.filter(deed => deed.auctionStatus === "upcoming");
  const ongoingDeeds = deeds.filter(deed => deed.auctionStatus === "ongoing");

  const startAuction = (tokenId, startingPriceInput, timerInput) => {
    setDeeds(prevDeeds =>
      prevDeeds.map(deed =>
        deed.tokenId === tokenId
          ? {
              ...deed,
              auctionStatus: "ongoing",
              startingPrice: startingPriceInput,
              timer: timerInput
            }
          : deed
      )
    );
  };
  
  return (
    <>
      <div className='auction-container'>
        <h1>Upcoming Auctions</h1> 
        <div className='card-container'>
        {upcomingDeeds.length === 0 ? (
            <p>No upcoming auctions found.</p>
          ) : (
            upcomingDeeds.map((deed) => (
              <AuctionCard 
              key={deed.tokenId}
              name={deed.name}
              description={deed.description}
              image={deed.image}
              price={deed.price}
              tokenId={deed.tokenId}
              buttonType="start"
              onButtonClick={(tokenId, startingPriceInput, timerInput) =>
                startAuction(tokenId, startingPriceInput, timerInput)
              }
              />
            ))
          )}
        </div>
      </div>
      <div className='auction-container'>
        <h1>Ongoing Auctions</h1> 
        <div className='card-container'>
        {ongoingDeeds.length === 0 ? (
            <p>No ongoing auctions found.</p>
          ) : (
            ongoingDeeds.map((deed) => (
              <AuctionCard 
                key={deed.tokenId}
                name={deed.name}
                description={deed.description}
                image={deed.image}
                price={deed.startingPrice}
                startingPrice={deed.startingPrice}
                tokenId={deed.tokenId}
                timer={deed.timer}
                buttonType="participate"
              /> 
            ))
          )}
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