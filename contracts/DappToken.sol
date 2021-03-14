// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

contract DappToken {
    string  public name = "DApp Token";
    string  public symbol = "NAAT";
    string  public standard = "DApp Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor () public {
        balanceOf[msg.sender] = 100000;
        totalSupply = 100000;
    }

    function addAddress() public {
        balanceOf[msg.sender]=0;
    }
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value,"not enough coins");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address payable _from, address payable _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from],"not enough coins in sender");
        //require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
    
    function getBalance(address _address) public view returns(uint){
        return balanceOf[_address];
    }
}