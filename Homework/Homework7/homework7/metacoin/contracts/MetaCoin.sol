pragma solidity ^0.4.4;

contract MetaCoin {
	mapping (address => uint) balances;
	address owner;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[msg.sender] = 10000;
		owner = msg.sender;
	}

	function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}

	function mint(uint amount) {
		if (msg.sender == owner) {
			balances[owner] += amount;
		}
		else {
			return;
		}
	}
}
