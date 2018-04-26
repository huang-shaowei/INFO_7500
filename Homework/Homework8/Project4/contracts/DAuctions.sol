pragma solidity ^0.4.2;
import "DAuction.sol";
import "DVickreyAuction.sol";
import "DDutchAuction.sol";
import "DEnglishAuction.sol";

//This code is provided for you. You can modify if you want to for debugging, but you shouldn't need to put any logic here.
contract DAuctions {

    mapping(uint256 => DAuction) auctions;
    uint256 numAuctions;

    // This function is used for testing
    function testAuction(uint256 id) returns (uint256 aid){
      return numAuctions;
    }
    
    function beginDutchAuction(uint256 reservePrice, address judgeAddress, uint256 biddingTimePeriod, uint256 offerPriceDecrement) returns(uint256 auctionID) {
        auctionID = numAuctions++;
        auctions[auctionID] = new DDutchAuction(reservePrice, judgeAddress, biddingTimePeriod, offerPriceDecrement);
        return auctionID;
    }

    function beginEnglishAuction(uint256 reservePrice, address judgeAddress, uint256 biddingTimePeriod, uint256 minBidIncrement) returns(uint256 auctionID) {
        auctionID = numAuctions++;
        auctions[auctionID] = new DEnglishAuction(reservePrice, judgeAddress, biddingTimePeriod, minBidIncrement);
        return auctionID;
    }

    function beginVickreyAuction(uint256 reservePrice, address judgeAddress, uint256 commitTimePeriod, uint256 revealTimePeriod, uint256 bidDepositAmount) returns(uint256 auctionID) {
        auctionID = numAuctions++;
        auctions[auctionID] = new DVickreyAuction(reservePrice, judgeAddress, commitTimePeriod, revealTimePeriod, bidDepositAmount);
        return auctionID;
    }

    function bid(uint256 id) payable returns(address) {
        return auctions[id].bid.value(msg.value)();
    }

    function finalize(uint256 id) {
        auctions[id].finalize();
    }

    function refund(uint256 id, uint256 amount) {
        auctions[id].refund(amount);
    }

    function revealBid(uint256 id, uint256 nonce) payable returns(address) {
        return auctions[id].revealBid.value(msg.value)(nonce);
    }

    function commitBid(uint256 id, bytes32 bidCommitment) payable returns(bool) {
        return auctions[id].commitBid.value(msg.value)(bidCommitment);
    }
}
