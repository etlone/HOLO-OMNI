// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HealthDataMarketplace is Ownable, ReentrancyGuard {
    IERC20 public healthToken;
    
    // Struct to store data sharing preferences
    struct DataSharing {
        bool isEnabled;
        uint256 tokenReward;
        uint256 lastRewardTime;
    }
    
    // Mapping of user address to their data sharing preferences
    mapping(address => DataSharing) public userDataSharing;
    
    // Events
    event DataShared(address indexed user, string dataHash);
    event RewardClaimed(address indexed user, uint256 amount);
    event DataSharingEnabled(address indexed user, uint256 rewardRate);
    event DataSharingDisabled(address indexed user);
    
    // Constants
    uint256 public constant REWARD_COOLDOWN = 1 days;
    uint256 public constant MIN_REWARD = 1e18; // 1 token
    uint256 public constant MAX_REWARD = 100e18; // 100 tokens
    
    constructor(address _healthToken) {
        healthToken = IERC20(_healthToken);
    }
    
    // Enable data sharing and set reward rate
    function enableDataSharing(uint256 _tokenReward) external {
        require(_tokenReward >= MIN_REWARD && _tokenReward <= MAX_REWARD, "Invalid reward amount");
        
        userDataSharing[msg.sender] = DataSharing({
            isEnabled: true,
            tokenReward: _tokenReward,
            lastRewardTime: 0
        });
        
        emit DataSharingEnabled(msg.sender, _tokenReward);
    }
    
    // Disable data sharing
    function disableDataSharing() external {
        require(userDataSharing[msg.sender].isEnabled, "Data sharing not enabled");
        
        delete userDataSharing[msg.sender];
        emit DataSharingDisabled(msg.sender);
    }
    
    // Share health data and receive tokens
    function shareHealthData(string calldata dataHash) external nonReentrant {
        DataSharing storage sharing = userDataSharing[msg.sender];
        require(sharing.isEnabled, "Data sharing not enabled");
        require(
            block.timestamp >= sharing.lastRewardTime + REWARD_COOLDOWN,
            "Reward cooldown not expired"
        );
        
        // Update last reward time
        sharing.lastRewardTime = block.timestamp;
        
        // Transfer tokens to user
        require(
            healthToken.transfer(msg.sender, sharing.tokenReward),
            "Token transfer failed"
        );
        
        emit DataShared(msg.sender, dataHash);
        emit RewardClaimed(msg.sender, sharing.tokenReward);
    }
    
    // Admin function to update token contract address
    function updateTokenContract(address _newToken) external onlyOwner {
        require(_newToken != address(0), "Invalid token address");
        healthToken = IERC20(_newToken);
    }
    
    // Admin function to withdraw tokens
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(
            healthToken.transfer(owner(), amount),
            "Token transfer failed"
        );
    }
    
    // View functions
    function getUserDataSharing(address user) external view returns (
        bool isEnabled,
        uint256 tokenReward,
        uint256 lastRewardTime
    ) {
        DataSharing memory sharing = userDataSharing[user];
        return (sharing.isEnabled, sharing.tokenReward, sharing.lastRewardTime);
    }
    
    function canShareData(address user) external view returns (bool) {
        DataSharing memory sharing = userDataSharing[user];
        return sharing.isEnabled &&
            block.timestamp >= sharing.lastRewardTime + REWARD_COOLDOWN;
    }
}
