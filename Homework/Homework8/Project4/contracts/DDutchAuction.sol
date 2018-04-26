pragma solidity ^0.4.2;
import "DAuction.sol";
contract DDutchAuction is DAuction {

    // constructor
    function DDutchAuction(uint256 reservePrice, address judgeAddress, uint256 biddingPeriod, uint256 offerPriceDecrement) DAuction(reservePrice, biddingPeriod, judgeAddress) {
        //TODO: place your code here
    }

    function bid() biddingOpen payable returns(address highestBidder) {
        //TODO: place your code here
        throw;
    }

    //TODO: place your code here
}
