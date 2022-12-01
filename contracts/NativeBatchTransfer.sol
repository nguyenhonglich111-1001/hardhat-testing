//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NativeBatchTransfer is Ownable {
    using SafeERC20 for IERC20;
    address public transferOperator; // Address to manage the Transfers

      // Modifiers
    modifier onlyOperator() {
        require(
            msg.sender == transferOperator,
            "Only operator can call this function."
        );
        _;
    }

    // Events
    event NewOperator(address transferOperator);
    event TransferReceived(address _from, address _to, uint amount);

    constructor(){
        transferOperator = msg.sender;
    }

    function updateOperator(address newOperator) public onlyOwner {

        require(newOperator != address(0), "Invalid operator address");

        transferOperator = newOperator;

        emit NewOperator(newOperator);
    }


    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendETH(address payable[] memory _addrs, uint256[] memory amounts) external payable onlyOperator{
        require(_addrs.length == amounts.length, "Invalid input parameters");

        for(uint i = 0; i < _addrs.length; i++) {
            _addrs[i].call{value: amounts[i]}("");
            emit TransferReceived(msg.sender,_addrs[i], msg.value);
        }

    }

  

    receive() external payable {}

}
