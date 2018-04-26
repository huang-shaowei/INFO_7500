var EventRegistration = artifacts.require("./EventRegistration.sol");

contract('EventRegistration', function(accounts) {

  it("number of tickets initially 0", function() {
    return EventRegistration.deployed().then(function(instance) {
      return instance.numTicketsSold.call();
    }).then(function(arg) {
      assert.equal(arg.valueOf(), 0, "Number of tickets sold isn't 0");
    });
  });

  it("should give correct initial quota", function() {
      return EventRegistration.deployed().then(function(instance) {
        return instance.ticketQuota.call();
      }).then(function(arg) {
        assert.equal(arg.valueOf(), 100, "quota is not 100");
      });
  });

  it("should give correct initial price", function() {
      return EventRegistration.deployed().then(function(instance) {
        return instance.ticketPrice.call();
      }).then(function(arg) {
        assert.equal(arg.valueOf(), 10, "Price is not 10");
      });
  });


  it("buying 10 tickets", function() {
     var eventreg;
     return EventRegistration.deployed().then(function(instance) {
       eventreg = instance;
       return eventreg.buyTickets("test1@test.com", 10, {from: accounts[1], value: 100});
     }).then(function() {
       return eventreg.numTicketsSold.call();
     }).then(function(arg) {
       assert.equal(arg.valueOf(), 10, "Number of tickets sold isn't 10: " + arg);
     });
   });

  it("Quiz 6, Question 3, Explain Me", function() {
     var eventreg;
     return EventRegistration.deployed().then(function(instance) {
       eventreg = instance;
       return eventreg.buyTickets("test1@test.com", 50, {from: accounts[1], value: 500});
     }).then(function (res) {
       return eventreg.numTicketsSold.call();
     }).then(function (numTicketsSold) {
        assert.equal(numTicketsSold.valueOf(), 50, "Num tickets is not 50");
        return eventreg.buyTickets("test1@test.com", 41, {from: accounts[1], value: 410});
     }).then(function (res) {
        assert(false, "should not succeed");
     }, function () {
        return eventreg.numTicketsSold.call();
     }).then(function (numTicketsSold) {
        assert.equal(numTicketsSold.valueOf(), 60, "num tickets is not 50 (2)");
     });
   });

});

