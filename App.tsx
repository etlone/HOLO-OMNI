import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens (to be created)
import HomeScreen from './src/screens/HomeScreen';
import HealthDataScreen from './src/screens/HealthDataScreen';
import VirtualGuideScreen from './src/screens/VirtualGuideScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import DataMarketplaceScreen from './src/screens/DataMarketplaceScreen';

const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f6f6f6',
    white: '#ffffff',
    black: '#000000',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Holistic Health' }} 
              />
              <Stack.Screen 
                name="HealthData" 
                component={HealthDataScreen} 
                options={{ title: 'Health Data' }} 
              />
              <Stack.Screen 
                name="VirtualGuide" 
                component={VirtualGuideScreen} 
                options={{ title: 'Virtual Guide' }} 
              />
              <Stack.Screen 
                name="Community" 
                component={CommunityScreen} 
                options={{ title: 'Community' }} 
              />
              <Stack.Screen 
                name="DataMarketplace" 
                component={DataMarketplaceScreen} 
                options={{ title: 'Data Marketplace' }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
