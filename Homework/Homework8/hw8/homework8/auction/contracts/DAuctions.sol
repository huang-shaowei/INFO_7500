pragma solidity ^0.4.2;
import "./DAuction.sol";
import "./DDutchAuction.sol";

//This code is provided for you. You can modify if you want to for debugging, but you shouldn't need to put any logic here.
contract DAuctions {

    mapping(uint256 => DAuction) auctions;
    uint256 numAuctions;

    // This function is used for testing
    function testAuction(uint256 id) public returns (uint256 aid){
      return numAuctions;
    }
    
    function beginDutchAuction(uint256 reservePrice, address judgeAddress, uint256 biddingTimePeriod, uint256 offerPriceDecrement) public returns(uint256 auctionID) {
        auctionID = numAuctions++;
        auctions[auctionID] = new DDutchAuction(reservePrice, judgeAddress, biddingTimePeriod, offerPriceDecrement);
        return auctionID;
    }

    function bid(uint256 id) public payable returns(address) {
        return auctions[id].bid.value(msg.value)();
    }

    function finalize(uint256 id) public {
        auctions[id].finalize();
    }

    function refund(uint256 id, uint256 amount) public {
        auctions[id].refund(amount);
    }
}
