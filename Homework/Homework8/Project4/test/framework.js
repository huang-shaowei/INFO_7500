// Each test should consist of a single call to run with the list of accounts, the done callback,
// and an auction schema describing the auction to run.
//
// An auction schema is an object with the following properties:
//    type:               A string denoting the type of auction to run.
//    reservePrice:       The auction reserve price.
//    judgeAddress:       For auctions with a judge, the address of the judge.
//    commitTimePeriod:   For auctions with bid commitments, the amount of time that the bidders
//                        have to commit their bids.
//    revealTimePeriod:   For auctions with bid commitments, the amount of time that the bidders
//                        have to reveal their bids.
//    bidDepositAmount:   For auctions with bid commitments, the amount of money that must be
//                        deposited for a bid commitment.
//    actions:            An ordered list of actions to run.
//
// An action is an object with the following properties:
//    block:              The block in which the action should occur.
//    action:             A string or callback function. If the action is a function, then running
//                        the action will cause the callback to be invoked with the list of
//                        accounts as its argument.
//
// If action is a string, the action must have the following additional properties:
//    succeed:            Whether the action should succeed.
//    on_error:           A message to show if the action succeeded when succeed is false or vice
//                        versa.
//
// "bid" actions can have the following additional properties:
//    account:            The index of the account that should bid.
//    payment:            The number of wei to bid.
//
// "commitBid" actions can have the following additional properties:
//    account:            The index of the account that should commit a bid.
//    payment:            The number of wei to which the account will commit a bid.
//    deposit:            The number of wei to pay as a bid commitment deposit. This parameter is
//                        optional and defaults to the value of bidDepositAmount that was specified
//                        when the auction was created.
//
// "revealBid" actions can have the following additional properties:
//    account:            The index of the account that should commit a bid.
//    payment:            The number of wei to pay when revealing a bid.
//    valid_nonce:        Should the commitment be opened with a valid nonce? This parameter is
//                        optional and defaults to true.
//
// "finalize" actions take no additional properties.
//

// Implementation

var abi = require('ethereumjs-abi');

// Run a test with the given accounts, done callback, and auction schema.
module.exports = function (accounts, done, schema) {
  var maincontract = DAuctions.deployed();
  var auctionId;
  var actions = schema.actions;
  var nonces = [];

  function error(message) {
    done(Error("Test: " + message));
  }

  function fail(action, message) {
    done(Error("Action " + action + ": " + message));
  }

  // Internal run actions function.
  function run_(block, index) {
    // If we've run out of actions, the test has passed.
    if (index >= actions.length) {
      done();
      return;
    }
    var action = actions[index];
    var nextBlock = block + 1;
    var nextIndex = index + 1;
    // If the next action takes place in a future block, delay.
    if (action.block > block) {
      maincontract.testAuction(auctionId).then(function (result) {
        run_(nextBlock, index);
      });
      return;
    }
    // If the next action takes place in a previous block, error.
    if (action.block != block) {
      return error("Current block is " + block + ", but action " + index +
          " takes place in prior block " + action.block);
    }
    // If the next action is a callback, execute it.
    if (typeof(action.action) == "function") {
      var result = action.action(accounts);
      if (result) {
        return fail(index, result);
      }
      // On successful evaluation of the callback, reinvoke ourselves.
      return run_(block, nextIndex);
    }
    // Run the action and get a promise.
    var promise;
    var account = accounts[action.account];
    var nonce = nonces[action.account];
    switch (action.action) {
      case "bid":
        promise = maincontract.bid(auctionId, { value: action.payment, from:account });
        break;
      case "commitBid":
        var commitment = "0x" + getCommitment(nonce, action.payment);
        var deposit = (action.deposit === undefined ? schema.bidDepositAmount : action.deposit);

        promise = maincontract.commitBid(auctionId, commitment, { from: account, value:deposit });
        break;
      case "revealBid":
        if (action.valid_nonce === false) {
          nonce = nonce + 1;
        }
        promise = maincontract.revealBid(auctionId, nonce, { from: account, value:action.payment });
        break;
      case "finalize":
        promise = maincontract.finalize(auctionId);
        break;
      default:
        return error("Unknown action " + action.action);
    }
    // Continue the computation after the promise.
    promise.then(function (result) {
      if (!action.succeed) {
        return fail(index, action.on_error);
      }
      run_(nextBlock, nextIndex);
    }).catch(function (error) {
      if (action.succeed) {
        return fail(index, action.on_error + ": " + error.toString().replace(/^error: /i, ""));
      }
      run_(nextBlock, nextIndex);
    });
  }

  // Start the contract.
  switch (schema.type) {
    case "english":
      maincontract.beginEnglishAuction.call(schema.reservePrice, schema.judgeAddress,
                                            schema.biddingTimePeriod, schema.minBidIncrement).then(function (result) {
        maincontract.beginEnglishAuction(schema.reservePrice, schema.judgeAddress,
                                         schema.biddingTimePeriod, schema.minBidIncrement).then(function (txId) {
          auctionId = result.c;
          run_(1, 0);
        });
      });
      return;
    case "dutch":
      maincontract.beginDutchAuction.call(schema.reservePrice, schema.judgeAddress,
                                          schema.biddingTimePeriod, schema.offerPriceDecrement).then(function (result) {
        maincontract.beginDutchAuction(schema.reservePrice, schema.judgeAddress,
                                         schema.biddingTimePeriod, schema.offerPriceDecrement).then(function (txId) {
          auctionId = result.c;
          run_(1, 0);
        });
      });
      return;
      case "vickrey":
        nonces = accounts.map(function () {
          return getRandomIntInclusive(0, 1000000);
        });
        maincontract.beginVickreyAuction.call(schema.reservePrice, schema.judgeAddress,
                                              schema.commitTimePeriod, schema.revealTimePeriod,
                                              schema.bidDepositAmount).then(function (result) {
          maincontract.beginVickreyAuction(schema.reservePrice, schema.judgeAddress,
                                           schema.commitTimePeriod, schema.revealTimePeriod,
                                           schema.bidDepositAmount).then(function (txId) {
            auctionId = result.c;
            run_(1, 0);
          });
        });
        return;
    default:
      return error("Unknown contract type " + schema.type);
  }
}

function getCommitment(val1, val2) {
  return abi.soliditySHA3(["uint", "uint"], [val1, val2]).toString('hex');
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
