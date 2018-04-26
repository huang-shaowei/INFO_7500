pragma solidity ^0.4.2;

import "./DAuction.sol";

contract DDutchAuction is DAuction {

    function DDutchAuction(uint256 _reservePrice, address _judgeAddress, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) DAuction(_reservePrice, _numBlocksAuctionOpen, _judgeAddress) public {
        //TODO: place your code here
		_offerPriceDecrement = offPriceDecrement;
    }

    function bid() public biddingOpen payable returns(address) {
        //TODO: place your code here
        assert(false);
    }

    //TODO: place your code here
	uint256 _reservePrice;
	uint256 _offerPriceDecrement;
}
