// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTAuction is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;
    
    constructor () ERC721("AuctionToken", "AUCTKN"){
        owner = payable(msg.sender);
    }

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

     function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        require(price > 0, "Price must not be negative");

        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        //Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        // emit TokenListedSuccess(
        //     tokenId,
        //     address(this),
        //     msg.sender,
        //     price,
        //     true
        // );
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will 
        //filter out currentlyListed == false over here
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            if(currentItem.currentlyListed == false) {
                continue;
            }
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs(bool profile) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                if(!profile && currentItem.currentlyListed == false) {
                    continue;
                }
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        // require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    // Function to allow other contracts (like our auction contract) to mark an NFT as no longer listed
    function markTokenNotListed(uint256 tokenId, address auctionContractAddress) public {
        require(idToListedToken[tokenId].currentlyListed, "Token is not listed");
        require(
            msg.sender == owner || 
            idToListedToken[tokenId].seller == msg.sender ||
            msg.sender == auctionContractAddress,
            "Not authorized"
        );
        
        idToListedToken[tokenId].currentlyListed = false;
    }
    
    //We might add a resell token function in the future
    //In that case, tokens won't be listed by default but users can send a request to actually list a token
    //Currently NFTs are listed by default

    function approveTokenForAuction(uint256 tokenId, address auctionContract) public {
        require(idToListedToken[tokenId].seller == msg.sender || owner == msg.sender, "Not authorized");
        _approve(auctionContract, tokenId);
    }
        
    // get number of items minted
    function getItemsMinted() public view returns (uint256) {
        return _tokenIds.current();
    }

    // check whether the token is listed or not
    function isTokenListed(uint256 tokenId) public view returns (bool) {
        return idToListedToken[tokenId].currentlyListed;
    }

    // set the token as listed or not listed
    function setTokenListed(uint256 tokenId, bool listed) public {
        // require(idToListedToken[tokenId].seller == msg.sender || owner == msg.sender, "Not authorized");
        idToListedToken[tokenId].currentlyListed = listed;
    }

    // // list nft again after auction from the new owner
    // function listNFTAgain(uint256 tokenId) public {
    //     idToListedToken[tokenId].currentlyListed = true;
    //     idToListedToken[tokenId].seller = payable(msg.sender);
    //     idToListedToken[tokenId].owner = payable(address(this));
    //     _transfer(msg.sender, address(this), tokenId);
    //     approve(address(this), tokenId);
    // }

    /// Owner calls this to re‑list their NFT at a new price
    function listNFTAgain(uint256 tokenId, uint256 price) external payable{
        // Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "Hopefully sending the correct price");

        // Transfer the NFT into this contract
        _transfer(msg.sender, address(this), tokenId);
        
        // Update our on‑chain listing record
        idToListedToken[tokenId].tokenId = tokenId;
        idToListedToken[tokenId].price = price;
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        idToListedToken[tokenId].owner = payable(address(this));

        // Allow the marketplace (this contract) to handle sales later
        // approve(address(this), tokenId);
    }

    // update the new seller of the token after auction
    function updateOwner(uint tokenId, address newSeller) public {
        idToListedToken[tokenId].owner = payable(newSeller);
        idToListedToken[tokenId].seller = payable(newSeller);
    }

    // update the new price of the token after auction
    function updatePrice(uint tokenId, uint256 newPrice) public {
        idToListedToken[tokenId].price = newPrice;
    }



}