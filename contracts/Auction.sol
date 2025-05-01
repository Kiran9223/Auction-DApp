// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Auction is ERC721Enumerable, ERC721URIStorage {
    uint256 private _tokenId = 1;

    struct AuctionItem {
    uint256 tokenId;
    address payable seller;
    uint256 startingPrice;
    uint256 highestBid;
    address payable highestBidder;
    uint256 endTime;
    bool isLive;
    bool isSold;
    }

    mapping(uint256 => AuctionItem) public auctions;

    event AuctionCreated(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 startingPrice,
        uint256 endTime
    );
    
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 bidAmount
    );

    event AuctionEnded(
        uint256 indexed tokenId,
        address indexed winner,
        uint256 winningBid
    );

    constructor() ERC721("AuctionToken", "ATK") {}

    function mintToken(string memory tokenURI) internal returns (uint256) {
        uint256 currentId = _tokenId;
        _mint(msg.sender, currentId);
        _setTokenURI(currentId, tokenURI);
        _tokenId++;
        return currentId;
    }

   // Create Auction
    function createAuction(string memory tokenURI, uint256 startingPrice, uint256 durationInSeconds) public {
        uint256 tokenId = mintToken(tokenURI);

        auctions[tokenId] = AuctionItem({
            tokenId: tokenId,
            seller: payable(msg.sender),
            startingPrice: startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: block.timestamp + durationInSeconds,
            isLive: true,
            isSold: false
        });

        // Transfer NFT to contract
        _transfer(msg.sender, address(this), tokenId);

        emit AuctionCreated(tokenId, msg.sender, startingPrice, block.timestamp + durationInSeconds);
    }

    mapping(address => uint256) public pendingReturns;

function placeBid(uint256 tokenId) public payable {
    AuctionItem storage auction = auctions[tokenId];

    require(auction.isLive, "Auction not live");
    require(block.timestamp < auction.endTime, "Auction ended");
    require(msg.value > auction.highestBid, "Bid too low");

    if (auction.highestBidder != address(0)) {
        // store funds instead of sending immediately
        pendingReturns[auction.highestBidder] += auction.highestBid;
    }

    auction.highestBid = msg.value;
    auction.highestBidder = payable(msg.sender);
    auctionBids[tokenId].push(Bid({
    bidder: msg.sender,
    amount: msg.value
}));

    emit BidPlaced(tokenId, msg.sender, msg.value);
}

function withdraw() public {
    uint amount = pendingReturns[msg.sender];
    require(amount > 0, "No funds");

    pendingReturns[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}


    // End Auction and claim item
    function endAuction(uint256 tokenId) public {
        AuctionItem storage auction = auctions[tokenId];

        require(auction.isLive, "Auction not live");
        require(block.timestamp >= auction.endTime, "Auction still active");
        require(!auction.isSold, "Auction already ended");

        auction.isLive = false;
        auction.isSold = true;

        if (auction.highestBidder != address(0)) {
            // Winner → Transfer NFT
            _transfer(address(this), auction.highestBidder, tokenId);
            // Send ETH to seller
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        } else {
            // No bids → return NFT to seller
            _transfer(address(this), auction.seller, tokenId);
        }
    }

    // Get Auction Details
    function getAuction(uint256 tokenId) public view returns (AuctionItem memory) {
        return auctions[tokenId];
    }

    // Get contract balance (optional utility)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function isAuctionEnded(uint256 tokenId) public view returns (bool) {
    return block.timestamp >= auctions[tokenId].endTime;
}
struct Bid {
    address bidder;
    uint256 amount;
}

Bid[] public bidHistory;
mapping(uint256 => Bid[]) public auctionBids;

function getBids(uint256 tokenId) public view returns (Bid[] memory) {
    return auctionBids[tokenId];
}

}