pragma solidity ^0.4.2;
contract DAuction {
    // constructor
    function DAuction(uint256 reservePrice, uint256 biddingTimePeriod, address judgeAddress) {
        //TODO: place your code here
    }

    // Three types of bidding functions. If not overriden, these generate errors
    function bid() biddingOpen payable returns(address highestBidder) {
        throw;
    }

    function commitBid(bytes32 bidCommitment) payable returns(bool) {
        throw;
    }

    function revealBid(uint256 nonce) payable returns(address highestBidder) {
        throw;
    }

    function finalize() auctionOver {
        //TODO: place your code here
        //N.B. you may need to override this for some auction types!
        throw;
    }

    // Part 2
    function refund(uint256 refundAmount) auctionOver judgeOnly {
        //TODO: place your code here
        throw;
    }

    modifier biddingOpen {
      //TODO: place your code here
      _;
    }

    modifier auctionOver {
      //TODO: place your code here
      _;
    }

    modifier judgeOnly {
      //TODO: place your code here
      _;
    }

    //TODO: place your code here
}
