import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  HealthData: undefined;
  VirtualGuide: undefined;
  Community: undefined;
  DataMarketplace: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const menuItems = [
    {
      title: 'Health Data',
      icon: 'heartbeat',
      screen: 'HealthData',
      description: 'Track and manage your health metrics',
    },
    {
      title: 'Virtual Guide',
      icon: 'user-md',
      screen: 'VirtualGuide',
      description: 'Get personalized health recommendations',
    },
    {
      title: 'Community',
      icon: 'users',
      screen: 'Community',
      description: 'Connect with your wellness community',
    },
    {
      title: 'Data Marketplace',
      icon: 'exchange',
      screen: 'DataMarketplace',
      description: 'Monetize your health data securely',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text h3 style={styles.welcome}>
          Welcome to Holistic Health
        </Text>
        <Text style={styles.subtitle}>
          Your personal wellness companion
        </Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <Card key={index} containerStyle={styles.card}>
            <Icon
              name={item.icon}
              type="font-awesome"
              color="#6200ee"
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Card.Title>{item.title}</Card.Title>
            <Text style={styles.cardText}>{item.description}</Text>
            <Button
              title="Open"
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
              buttonStyle={styles.button}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  welcome: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#6200ee',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  menuGrid: {
    padding: 10,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 10,
  },
  cardText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    marginTop: 10,
  },
});
