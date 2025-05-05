# 🌟 Meta Mart 🌟
## 🔥An NFT Marketplace and Auction platform (DApp)🔥

## CPSC 559 Advanced Blockchain Technologies

## Authors
```
Kiran Sukumar, 814198594
Padmapriya 
```

## Installation and Setup 
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
