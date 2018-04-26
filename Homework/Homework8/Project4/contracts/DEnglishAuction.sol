pragma solidity ^0.4.2;
import "DAuction.sol";
// Part 3
contract DEnglishAuction is DAuction {

    // constructor
    function DEnglishAuction(uint256 reservePrice, address judgeAddress, uint256 biddingTimePeriod, uint256 minBidIncrement) DAuction(reservePrice, biddingTimePeriod, judgeAddress) {
        //TODO: place your code here
    }

    function bid() biddingOpen payable returns(address highestBidder) {
        throw;
        //TODO: place your code here
    }

    //TODO: place your code here
}
