// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthToken is ERC20, Ownable {
    uint8 private constant _decimals = 18;
    uint256 private constant _initialSupply = 1000000 * (10 ** 18); // 1 million tokens

    // Marketplace contract address
    address public marketplace;
    
    constructor() ERC20("Health Token", "HLTH") {
        _mint(msg.sender, _initialSupply);
    }
    
    // Set marketplace contract address
    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid marketplace address");
        marketplace = _marketplace;
    }
    
    // Override decimals function
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }
    
    // Mint new tokens (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // Burn tokens
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    // Override transfer to add marketplace validation
    function transfer(address to, uint256 amount) public override returns (bool) {
        if (msg.sender == marketplace) {
            // Allow marketplace contract to transfer tokens freely
            return super.transfer(to, amount);
        }
        
        // For regular transfers, ensure amount is within limits
        require(amount <= balanceOf(msg.sender) / 2, "Transfer amount too high");
        return super.transfer(to, amount);
    }
    
    // Override transferFrom to add marketplace validation
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (msg.sender == marketplace) {
            // Allow marketplace contract to transfer tokens freely
            return super.transferFrom(from, to, amount);
        }
        
        // For regular transfers, ensure amount is within limits
        require(amount <= balanceOf(from) / 2, "Transfer amount too high");
        return super.transferFrom(from, to, amount);
    }
}
