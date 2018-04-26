pragma solidity ^0.4.18;

contract EventRegistration {
	struct Registrant {
		uint amount;
		uint numTickets;
		string email;
	}

	address public owner;
	uint public numTicketsSold;
	uint public ticketQuota;
	uint public ticketPrice;
	mapping (address => Registrant) registrantsPaid;


    event Deposit(address _from, uint _amount);
    event Refund(address _to, uint _amount);
    event BuyTicketsCall();

    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

    modifier soldOut() {
        require (numTicketsSold < ticketQuota);
        _;
    }

    function EventRegistration(uint _ticketQuota, uint _ticketPrice) public {
        owner = msg.sender;
        numTicketsSold = 0;
        ticketQuota = _ticketQuota;
        ticketPrice = _ticketPrice;
    }

    function buyTickets(string email, uint numTickets) public payable soldOut {
        uint totalAmount = ticketPrice*numTickets;
        require (msg.value >= totalAmount);

       if (registrantsPaid[msg.sender].amount > 0) {
           registrantsPaid[msg.sender].amount += totalAmount;
           registrantsPaid[msg.sender].email = email;
           registrantsPaid[msg.sender].numTickets += numTickets;
       } else {
           Registrant storage r = registrantsPaid[msg.sender];
           r.amount = totalAmount;
           r.email = email;
           r.numTickets = numTickets;
       }

       numTicketsSold = numTicketsSold+numTickets;

       if (msg.value > totalAmount) {
           uint refundAmount = msg.value - totalAmount;
           require (msg.sender.send(refundAmount));
       }

       Deposit(msg.sender, msg.value);
    }

    function refundTicket(address buyer) public onlyOwner {
        if (registrantsPaid[buyer].amount > 0) {
            if (this.balance >= registrantsPaid[buyer].amount) {
                registrantsPaid[buyer].amount = 0;
                numTicketsSold = numTicketsSold - registrantsPaid[buyer].numTickets;
                require (buyer.send(registrantsPaid[buyer].amount));
                Refund(buyer, registrantsPaid[buyer].amount);
            }
        }
    }

    function withdrawFunds() public onlyOwner {
        require (owner.send(this.balance));
    }

    function getRegistrantAmountPaid(address buyer) public view returns(uint) {
        return registrantsPaid[buyer].amount;
    }

    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}

