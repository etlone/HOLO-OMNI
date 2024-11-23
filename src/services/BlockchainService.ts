import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HealthTokenABI from '../contracts/artifacts/HealthToken.json';
import HealthDataMarketplaceABI from '../contracts/artifacts/HealthDataMarketplace.json';

class BlockchainService {
    private static instance: BlockchainService;
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet | null = null;
    private healthToken: ethers.Contract | null = null;
    private marketplace: ethers.Contract | null = null;

    // Contract addresses - replace with actual deployed addresses
    private readonly HEALTH_TOKEN_ADDRESS = 'YOUR_DEPLOYED_TOKEN_ADDRESS';
    private readonly MARKETPLACE_ADDRESS = 'YOUR_DEPLOYED_MARKETPLACE_ADDRESS';

    private constructor() {
        this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    }

    public static getInstance(): BlockchainService {
        if (!BlockchainService.instance) {
            BlockchainService.instance = new BlockchainService();
        }
        return BlockchainService.instance;
    }

    // Initialize wallet and contracts
    public async initialize(): Promise<void> {
        try {
            // Load or create wallet
            const privateKey = await AsyncStorage.getItem('walletPrivateKey');
            if (privateKey) {
                this.wallet = new ethers.Wallet(privateKey, this.provider);
            } else {
                this.wallet = ethers.Wallet.createRandom().connect(this.provider);
                await AsyncStorage.setItem('walletPrivateKey', this.wallet.privateKey);
            }

            // Initialize contracts
            this.healthToken = new ethers.Contract(
                this.HEALTH_TOKEN_ADDRESS,
                HealthTokenABI.abi,
                this.wallet
            );

            this.marketplace = new ethers.Contract(
                this.MARKETPLACE_ADDRESS,
                HealthDataMarketplaceABI.abi,
                this.wallet
            );
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error);
            throw error;
        }
    }

    // Get wallet address
    public getWalletAddress(): string {
        return this.wallet?.address || '';
    }

    // Get token balance
    public async getTokenBalance(): Promise<string> {
        try {
            const balance = await this.healthToken?.balanceOf(this.wallet?.address);
            return ethers.utils.formatEther(balance || 0);
        } catch (error) {
            console.error('Failed to get token balance:', error);
            return '0';
        }
    }

    // Enable data sharing
    public async enableDataSharing(tokenReward: string): Promise<boolean> {
        try {
            const tx = await this.marketplace?.enableDataSharing(
                ethers.utils.parseEther(tokenReward)
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Failed to enable data sharing:', error);
            return false;
        }
    }

    // Disable data sharing
    public async disableDataSharing(): Promise<boolean> {
        try {
            const tx = await this.marketplace?.disableDataSharing();
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Failed to disable data sharing:', error);
            return false;
        }
    }

    // Share health data
    public async shareHealthData(dataHash: string): Promise<boolean> {
        try {
            const tx = await this.marketplace?.shareHealthData(dataHash);
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Failed to share health data:', error);
            return false;
        }
    }

    // Check if user can share data
    public async canShareData(): Promise<boolean> {
        try {
            return await this.marketplace?.canShareData(this.wallet?.address);
        } catch (error) {
            console.error('Failed to check data sharing status:', error);
            return false;
        }
    }

    // Get user data sharing settings
    public async getDataSharingSettings(): Promise<{
        isEnabled: boolean;
        tokenReward: string;
        lastRewardTime: number;
    }> {
        try {
            const settings = await this.marketplace?.getUserDataSharing(this.wallet?.address);
            return {
                isEnabled: settings[0],
                tokenReward: ethers.utils.formatEther(settings[1]),
                lastRewardTime: settings[2].toNumber(),
            };
        } catch (error) {
            console.error('Failed to get data sharing settings:', error);
            return {
                isEnabled: false,
                tokenReward: '0',
                lastRewardTime: 0,
            };
        }
    }

    // Transfer tokens
    public async transferTokens(to: string, amount: string): Promise<boolean> {
        try {
            const tx = await this.healthToken?.transfer(
                to,
                ethers.utils.parseEther(amount)
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Failed to transfer tokens:', error);
            return false;
        }
    }
}

export default BlockchainService;
