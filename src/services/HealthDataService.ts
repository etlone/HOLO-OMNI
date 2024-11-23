import * as ExpoHealth from 'expo-health';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { blockchainService } from './BlockchainService';

export interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  calories: number;
  distance: number;
}

class HealthDataService {
  private isInitialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      const isAvailable = await ExpoHealth.isAvailable();
      if (!isAvailable) {
        throw new Error('Health data is not available on this device');
      }

      const authorized = await this.requestPermissions();
      this.isInitialized = authorized;
      return authorized;
    } catch (error) {
      console.error('Failed to initialize health service:', error);
      return false;
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      const result = await ExpoHealth.requestPermissionsAsync([
        ExpoHealth.PermissionKind.Steps,
        ExpoHealth.PermissionKind.HeartRate,
        ExpoHealth.PermissionKind.SleepAnalysis,
        ExpoHealth.PermissionKind.ActiveEnergyBurned,
        ExpoHealth.PermissionKind.DistanceWalkingRunning,
      ]);
      return result.status === 'granted';
    } catch (error) {
      console.error('Failed to request health permissions:', error);
      return false;
    }
  }

  async getTodayData(): Promise<HealthData | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const [steps, heartRate, sleep, calories, distance] = await Promise.all([
        this.getSteps(startOfDay, endOfDay),
        this.getHeartRate(startOfDay, endOfDay),
        this.getSleepHours(startOfDay, endOfDay),
        this.getCalories(startOfDay, endOfDay),
        this.getDistance(startOfDay, endOfDay),
      ]);

      const healthData: HealthData = {
        steps,
        heartRate,
        sleepHours: sleep,
        calories,
        distance,
      };

      // Cache the data
      await this.cacheHealthData(healthData);

      // If data sharing is enabled, send to blockchain
      const sharingEnabled = await AsyncStorage.getItem('healthDataSharing');
      if (sharingEnabled === 'true') {
        await this.shareHealthData(healthData);
      }

      return healthData;
    } catch (error) {
      console.error('Failed to get health data:', error);
      return null;
    }
  }

  private async getSteps(start: Date, end: Date): Promise<number> {
    try {
      const steps = await ExpoHealth.getStepCountAsync(start, end);
      return steps.reduce((total, current) => total + current.value, 0);
    } catch {
      return 0;
    }
  }

  private async getHeartRate(start: Date, end: Date): Promise<number> {
    try {
      const heartRates = await ExpoHealth.getHeartRateAsync(start, end);
      const values = heartRates.map(hr => hr.value);
      return values.length > 0 ? 
        values.reduce((a, b) => a + b) / values.length : 
        0;
    } catch {
      return 0;
    }
  }

  private async getSleepHours(start: Date, end: Date): Promise<number> {
    try {
      const sleep = await ExpoHealth.getSleepAnalysisAsync(start, end);
      return sleep.reduce((total, current) => {
        const duration = (current.endDate.getTime() - current.startDate.getTime()) / (1000 * 60 * 60);
        return total + duration;
      }, 0);
    } catch {
      return 0;
    }
  }

  private async getCalories(start: Date, end: Date): Promise<number> {
    try {
      const calories = await ExpoHealth.getActiveEnergyBurnedAsync(start, end);
      return calories.reduce((total, current) => total + current.value, 0);
    } catch {
      return 0;
    }
  }

  private async getDistance(start: Date, end: Date): Promise<number> {
    try {
      const distance = await ExpoHealth.getDistanceWalkingRunningAsync(start, end);
      return distance.reduce((total, current) => total + current.value, 0);
    } catch {
      return 0;
    }
  }

  private async cacheHealthData(data: HealthData): Promise<void> {
    try {
      const date = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`healthData_${date}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to cache health data:', error);
    }
  }

  private async shareHealthData(data: HealthData): Promise<void> {
    try {
      // Hash and anonymize the data before sharing
      const anonymizedData = await this.anonymizeData(data);
      
      // Store in IPFS or your preferred decentralized storage
      // This is a placeholder for actual IPFS integration
      const dataHash = 'QmHash...'; // Replace with actual IPFS hash

      // Reward the user with tokens for sharing data
      await blockchainService.transferTokens(
        await AsyncStorage.getItem('userWalletAddress') || '',
        '10' // Token reward amount
      );
    } catch (error) {
      console.error('Failed to share health data:', error);
    }
  }

  private async anonymizeData(data: HealthData): Promise<string> {
    // This is a placeholder for actual data anonymization
    // In a production environment, implement proper anonymization techniques
    return JSON.stringify(data);
  }

  // Add more health data related functions as needed
}

// Export a singleton instance
export const healthDataService = new HealthDataService();
