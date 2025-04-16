// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Auction is ERC721URIStorage {
    uint256 private _tokenId = 1;

    struct AuctionItem {
        uint256 tokenId;
        address payable seller;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool isActive;
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

    function mintToken(string memory tokenURI) internal returns (bool) {
         _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
         _tokenId++;
        return true;
    }

    mapping(address => uint256) biddersData;
    uint256 public highestBidAmount;
    address public highestBidder;
    uint256 startTime = block.timestamp;
    uint256 endTime;


    // put new bid
    function placeBid() public payable {
        uint256 totalAmount = biddersData[msg.sender] + msg.value;

        // require(block.timestamp < endTime, "Auction has ended");
        // require(msg.value > 0, "Bid amount must be greater than zero");
        // require(totalAmount > highestBidAmount, "Bid amount must be higher than the current highest bid");
        
        biddersData[msg.sender] = totalAmount;
        highestBidAmount = totalAmount;
        highestBidder = msg.sender;
    }

    // get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // get bidders bid
    function getBiddersBid(address _address) public view returns (uint256) {
        return biddersData[_address];
    }

    // get highest bid amount
    function getHighestBidAmount() public view returns (uint256) {
        return highestBidAmount;
    }

    // highest bidder details
    function getHighestBidder() public view returns (address) {
        return highestBidder;
    }

    // end auction
    // function endAuction(uint _endTime) public {
    //     endTime = block.timestamp + _endTime;
    // }
    
    // withdraw funds
    function withdrawFunds(address payable _address) public {
        if(biddersData[_address] > 0){
            _address.transfer(biddersData[_address]);
        }
    }

    
}