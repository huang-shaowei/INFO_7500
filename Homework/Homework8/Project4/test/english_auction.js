var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BigNumber = require('bignumber.js');
var run = require('./framework.js');

// Tests

contract('English Auction', function(accounts) {
  it("creates an english auction", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [],
    });
  });

  it("accepts the first valid bid", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 400, succeed: true, on_error: "Valid first bid rejected" },
      ],
    });
  });

  it("rejects a lower value second bid", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 400, succeed: true,  on_error: "Valid first bid rejected" },
        { block: 2, action: "bid", account: 2, payment: 399, succeed: false, on_error: "Low-value bid accepted" },
      ],
    });
  });

  it("accepts a second bid", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 400, succeed: true, on_error: "Valid first bid rejected" },
        { block: 3, action: "bid", account: 2, payment: 450, succeed: true, on_error: "Valid new highest bid rejected" },
      ],
    });
  });

  it("rejects a bid with a small increment", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [
        { block: 3, action: "bid", account: 2, payment: 450, succeed: true,  on_error: "Valid new highest bid rejected" },
        { block: 4, action: "bid", account: 3, payment: 455, succeed: false, on_error: "Bid with too-small increment accepted" },
      ],
    });
  });

  it("rejects a late bid", function(done) {
    run(accounts, done, {
      type:              "english",
      reservePrice:      300,
      judgeAddress:      0,
      biddingTimePeriod: 5,
      minBidIncrement:   25,
      actions: [
        { block: 3, action: "bid", account: 2, payment: 450, succeed: true,  on_error: "Valid new highest bid rejected" },
        { block: 8, action: "bid", account: 3, payment: 999, succeed: false, on_error: "Late bid accepted" },
      ],
    });
  });

  // TODO: Add tests here
});
