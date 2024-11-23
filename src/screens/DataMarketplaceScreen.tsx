import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, Card, Button, Icon, Divider } from 'react-native-elements';

interface DataCategory {
  id: number;
  name: string;
  description: string;
  shared: boolean;
  tokenReward: number;
  subscribers: number;
}

const mockDataCategories: DataCategory[] = [
  {
    id: 1,
    name: 'Activity Data',
    description: 'Steps, exercise, and movement patterns',
    shared: false,
    tokenReward: 50,
    subscribers: 1234,
  },
  {
    id: 2,
    name: 'Sleep Patterns',
    description: 'Sleep duration, quality, and cycles',
    shared: false,
    tokenReward: 30,
    subscribers: 892,
  },
  {
    id: 3,
    name: 'Heart Rate',
    description: 'Continuous heart rate monitoring data',
    shared: false,
    tokenReward: 40,
    subscribers: 1567,
  },
  {
    id: 4,
    name: 'Nutrition',
    description: 'Dietary habits and nutritional intake',
    shared: false,
    tokenReward: 35,
    subscribers: 743,
  },
];

export default function DataMarketplaceScreen() {
  const [dataCategories, setDataCategories] = useState<DataCategory[]>(mockDataCategories);
  const [totalTokens, setTotalTokens] = useState(100);

  const toggleDataSharing = (categoryId: number) => {
    setDataCategories(categories =>
      categories.map(category => {
        if (category.id === categoryId) {
          if (!category.shared) {
            setTotalTokens(current => current + category.tokenReward);
          } else {
            setTotalTokens(current => current - category.tokenReward);
          }
          return { ...category, shared: !category.shared };
        }
        return category;
      })
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Icon
            name="token"
            type="material-community"
            color="#6200ee"
            size={30}
          />
          <Text h4 style={styles.balanceText}>
            {totalTokens} Tokens
          </Text>
        </View>
        <Text style={styles.balanceSubtext}>
          Earn tokens by sharing your anonymized health data
        </Text>
      </Card>

      <Card containerStyle={styles.marketplaceCard}>
        <Card.Title>Data Marketplace</Card.Title>
        <Text style={styles.marketplaceDescription}>
          Choose which health data you'd like to share anonymously with researchers
          and earn tokens in return.
        </Text>

        {dataCategories.map(category => (
          <View key={category.id}>
            <View style={styles.categoryContainer}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                <View style={styles.statsContainer}>
                  <Icon
                    name="account-group"
                    type="material-community"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.statsText}>
                    {category.subscribers} subscribers
                  </Text>
                  <Icon
                    name="token"
                    type="material-community"
                    size={16}
                    color="#666"
                    style={styles.tokenIcon}
                  />
                  <Text style={styles.statsText}>
                    {category.tokenReward} tokens/month
                  </Text>
                </View>
              </View>
              <Switch
                value={category.shared}
                onValueChange={() => toggleDataSharing(category.id)}
                trackColor={{ false: '#767577', true: '#6200ee' }}
                thumbColor={category.shared ? '#ffffff' : '#f4f3f4'}
              />
            </View>
            <Divider style={styles.divider} />
          </View>
        ))}

        <View style={styles.privacyInfo}>
          <Icon
            name="shield-check"
            type="material-community"
            color="#4CAF50"
            size={24}
          />
          <Text style={styles.privacyText}>
            Your data is anonymized and encrypted before sharing. You can opt-out at
            any time.
          </Text>
        </View>
      </Card>

      <Card containerStyle={styles.redeemCard}>
        <Card.Title>Redeem Tokens</Card.Title>
        <Text style={styles.redeemDescription}>
          Use your earned tokens for premium features, health products, or convert
          to cryptocurrency.
        </Text>
        <Button
          title="View Rewards"
          icon={{
            name: 'gift',
            type: 'material-community',
            color: 'white',
          }}
          buttonStyle={styles.redeemButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    marginBottom: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  balanceText: {
    marginLeft: 10,
    color: '#6200ee',
  },
  balanceSubtext: {
    textAlign: 'center',
    color: '#666',
  },
  marketplaceCard: {
    marginBottom: 10,
  },
  marketplaceDescription: {
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    color: '#666',
    marginVertical: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statsText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  tokenIcon: {
    marginLeft: 10,
  },
  divider: {
    backgroundColor: '#eee',
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  privacyText: {
    flex: 1,
    marginLeft: 10,
    color: '#2E7D32',
  },
  redeemCard: {
    marginBottom: 20,
  },
  redeemDescription: {
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  redeemButton: {
    backgroundColor: '#6200ee',
  },
});
