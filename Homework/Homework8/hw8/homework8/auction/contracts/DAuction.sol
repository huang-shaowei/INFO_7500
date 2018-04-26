pragma solidity ^0.4.2;
contract DAuction {
	
	uint _initialPrice;
	uint _startTime;
	uint _offerPriceDecrement;
	address _highestBidder = 0x0000;
	uint _winningBid = 0;
	uint _biddingPeriod = 0;
	
	uint256 _reservePrice;
	address _jidgeAddress;
	
    // constructor
    function DAuction(uint256 _reservePrice, uint256 _numBlocksAuctionOpen, address _judgeAddress) public {
        //TODO: place your code here
		_reservePrice = reservePrice;
		_startTime = getBlockNumber();
        _initialPrice = initialPrice;
        _offerPriceDecrement = offerPriceDecrement;
        _biddingPeriod = biddingPeriod;
    }

    function bid() public biddingOpen payable returns(address highestBidder) {
        //TODO: place your code here
		if (biddingOpen())
        {
            if (msg.value < currentPrice()) throw;
            _highestBidder = msg.sender;
            _winningBid = msg.value;
            return _highestBidder;
        }
        msg.sender.transfer(msg.value);
        throw;
        
    }

    function finalize() auctionOver public {
        //TODO: place your code here
		if (biddingOpen()) throw;
        msg.sender.send(_winningBid);
        selfdestruct(_creator);
        
    }

    // Part 2
    function refund(uint256 refundAmount) public auctionOver judgeOnly {
        //TODO: place your code here
        assert(false);
    }

    modifier biddingOpen {
      ////TODO: place your code here
      _;
    }

    modifier auctionOver {
      //TODO: place your code here
	  assert(block.number >= endBlock);
      _;
    }

    modifier judgeOnly {
      //TODO: place your code here
      _;
    }

    //TODO: place your code here
	function currentPrice() constant returns(uint currentPrice) {
        //TODO: place your code here
        uint duration = getBlockNumber() - _startTime;
        if (biddingOpen())
            return _initialPrice - (duration * _offerPriceDecrement);
        else
            return 0;
    }
	
	function biddingOpen() constant returns(bool isOpen) {
        //TODO: place your code here
        uint duration = getBlockNumber() - _startTime;
        if (_winningBid != 0)
            return false;
        return (duration >= 0 && duration < _biddingPeriod);
    }
	
	function getWinningBidder() constant returns(address winningBidder) {
        //TODO: place your code here
        return _winningBidder;
    }

}
