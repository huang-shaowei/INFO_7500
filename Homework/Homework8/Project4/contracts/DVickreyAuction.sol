pragma solidity ^0.4.2;
import "DAuction.sol";
//Part 4
contract DVickreyAuction is DAuction {

    // constructor
    function DVickreyAuction(uint256 reservePrice, address judgeAddress, uint256 commitTimePeriod, uint256 revealTimePeriod, uint256 bidDepositAmount) DAuction(reservePrice, commitTimePeriod + revealTimePeriod, judgeAddress) {
        //TODO: place your code here
    }

    function commitBid(bytes32 bidCommitment) payable returns(bool) {
        //TODO: place your code here
        throw;
    }

    function revealBid(uint256 nonce) payable returns(address highestBidder) {
        throw;
        //TODO: place your code here
    }

  //TODO: place your code here
}
