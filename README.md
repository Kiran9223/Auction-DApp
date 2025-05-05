# 🌟 Meta Mart 🌟
## 🔥An NFT Marketplace and Auction platform (DApp)🔥
- This project is a full-featured NFT Auction platform DApp, designed and built from scratch.
### It enables users to:
- Mint/Create NFTs (from Profile page).
- View all NFTs (Marketplace page).
- Buy NFTs directly (Marketplace page — fixed price buy).
- Start Auctions for NFTs (Auction page — list NFTs for auction).
- Participate in Auctions (Auction page — live bidding).
- Claim Won NFTs from Auctions (Auction page — after winning bid).
- Reclaim NFTs from unsold Auctions (Auction page).
- View Owned NFTs & Mint new ones (Profile page — NFT dashboard).

## 💻 CPSC 559 Advanced Blockchain Technologies 💻

## ⌨️ Authors ⌨️
```
Kiran Sukumar, 814198594
Padmapriya, 829070978 
```

## ⚙️ Installation and Setup ⚙️
- Clone the repository to local
- Setup Ganache
- Update truffle-config.js with your port and network id from Ganache
- In terminal, execute "truffle compile"
- In terminal, execute "truffle migrate"
- The smart contracts will be compiled, built and deployed in your local Ganache
- Copy "Auction.json" and "NFTAuction.json" from build folder and,
- Navigate to "auction-frontend -> src -> abis" and paste both the files here
- In "auction-frontend -> src -> pinata.js" update your secret and key for the IPFS storage (alternatively, can be stored in .env and retrieved)
- Open new terminal and navigate to "auction-frontend" and execute "npm install"
- Execute "npm run dev" to start the react application
