var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BigNumber = require('bignumber.js');
var run = require('./framework.js');

// Tests

contract('Vickrey Auction', function(accounts) {
  it("creates a vickrey auction", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [],
    });
  });

  it("accepts the first valid bid", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true, on_error: "Valid first commit bid rejected" },
      ],
    });
  });

  it("rejects an early reveal attempt", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true,  on_error: "Valid first commit bid rejected" },
        { block: 2, action: "revealBid", account: 1, payment: 600, succeed: false, on_error: "Early reveal accepted" },
      ],
    });
  });

  it("accepts a second bid", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment:  600, succeed: true, on_error: "Valid first bid rejected" },
        { block: 3, action: "commitBid", account: 2, payment: 1000, succeed: true, on_error: "Valid second bid rejected" },
      ],
    });
  });

  it("rejects a bid without a deposit", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, deposit: 0, succeed: false, on_error: "Commit without deposit accepted" },
      ],
    });
  });

  it("rejects a late bid", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true,  on_error: "Valid first bid rejected" },
        { block: 8, action: "commitBid", account: 3, payment: 999, succeed: false, on_error: "Late bid accepted" },
      ],
    });
  });

  it("opens a valid bit commitment", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true, on_error: "Valid first bid rejected" },
        { block: 8, action: "revealBid", account: 1, payment: 600, succeed: true, on_error: "first bid not revealed" },
      ],
    });
  });

  it("rejects an invalid commitment opening", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true,  on_error: "Valid first bid rejected" },
        { block: 8, action: "revealBid", account: 1, payment: 700, succeed: false, on_error: "revealBid accepted invalid payment" },
      ],
    });
  });

  it("rejects an opening with an incorrect nonce", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment: 600, succeed: true, on_error: "Valid first bid rejected" },
        { block: 8, action: "revealBid", account: 1, payment: 600, valid_nonce: false, succeed: false, on_error: "revealBid accepted an invalid nonce" },
      ],
    });
  });

  it("rejects reveal of a nonexistent bid", function(done) {
    run(accounts, done, {
      type:             "vickrey",
      reservePrice:     500,
      judgeAddress:     0,
      commitTimePeriod: 6,
      revealTimePeriod: 7,
      bidDepositAmount: 5000,
      actions: [
        { block: 1, action: "commitBid", account: 1, payment:  600, succeed: true,  on_error: "Valid first bid rejected" },
        { block: 8, action: "revealBid", account: 2, payment: 1200, succeed: false, on_error: "revealBid accepted an uncommitted bid" },
      ],
    });
  });

  // TODO: Add tests here
});
