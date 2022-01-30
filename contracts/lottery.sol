pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }

    function enterLottery() public payable {
        require(msg.value > .01 ether); // validation for payment
        players.push(msg.sender);
    }

    function randomGenerator() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }   

    modifier onlyManagerAccess() {
        require(msg.sender == manager);
        _;
    }

    function pickWinner() public onlyManagerAccess payable{
        uint index = randomGenerator() % players.length; 

        players[index].transfer(this.balance);
        players = new address[](0);
    }

    function getAllParticipants() public onlyManagerAccess view returns(address[]){
        return players;
    }

    // function getTotalGas() public {

    // }

}