var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BigNumber = require('bignumber.js');
var run = require('./framework.js');

// Tests

contract('Dutch Auction', function (accounts) {
  it("creates a dutch auction", function (done) {
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        500,
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [],
    });
  });

  it("rejects a low bid", function (done) {
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        500,
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 450, succeed: false, on_error: "Low bid accepted" },
      ],
    });
  });

  it("accepts good bid", function (done) {
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        500,
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 725, succeed: true, on_error: "Valid bid rejected" },
      ],
    });
  });

  it("changes balance correctly", function (done) {
    var payment = new BigNumber("2000000000000000");
    // The initial balance of the account.
    var initial_balance;
    // A callback action that will get the initial balance for account 1.
    function get_initial_balance(accounts) {
      initial_balance = web3.eth.getBalance(accounts[1]);
    }
    // A callback action that will check the final balance for account 1 and return any error messages.
    function check_final_balance(accounts) {
      var final_balance = web3.eth.getBalance(accounts[1]);
      var diff = initial_balance.minus(final_balance);
      if (diff.lessThan(payment)) {
        return "Account debited too little for bid";
      }
    }
    // Run the test.
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        payment.dividedBy(2),
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [
        { block: 1, action: get_initial_balance },
        { block: 1, action: "bid", account: 1, payment: payment, succeed: true, on_error: "Valid bid rejected" },
        { block: 2, action: check_final_balance },
      ],
    });
  });

  it("rejects second bid", function (done) {
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        500,
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [
        { block: 1, action: "bid", account: 1, payment: 725, succeed: true,  on_error: "Valid bid rejected" },
        { block: 2, action: "bid", account: 2, payment: 750, succeed: false, on_error: "Second bid accepted" },
      ],
    });
  });

  it("rejects early finalize", function (done) {
    run(accounts, done, {
      type:                "dutch",
      reservePrice:        500,
      judgeAddress:        0,
      biddingTimePeriod:   10,
      offerPriceDecrement: 25,
      actions: [
        { block: 1, action: "bid",      account: 1, payment: 725, succeed: true,  on_error: "Valid bid rejected" },
        { block: 2, action: "finalize",                           succeed: false, on_error: "Early finalize accepted" },
      ],
    });
  });

  // TODO: Add tests here
});
