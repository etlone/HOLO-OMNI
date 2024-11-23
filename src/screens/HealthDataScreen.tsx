import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const mockHealthData = {
  steps: [2000, 5000, 7500, 10000, 8000, 6000, 9000],
  heartRate: [72, 75, 68, 80, 73, 70, 74],
  sleep: [6.5, 7, 8, 7.5, 6, 8.5, 7.5],
};

export default function HealthDataScreen() {
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const [connected, setConnected] = useState(false);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    strokeWidth: 2,
  };

  const getChartData = () => {
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: mockHealthData[selectedMetric],
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
    return data;
  };

  const connectWearable = async () => {
    // Simulating wearable connection
    setConnected(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.connectionCard}>
        <Card.Title>Wearable Device</Card.Title>
        <Button
          icon={
            <Icon
              name={connected ? 'bluetooth-connected' : 'bluetooth'}
              type="material"
              color="white"
              size={20}
              style={{ marginRight: 10 }}
            />
          }
          title={connected ? 'Connected' : 'Connect Device'}
          onPress={connectWearable}
          buttonStyle={{
            backgroundColor: connected ? '#4CAF50' : '#6200ee',
          }}
        />
      </Card>

      <View style={styles.metricButtons}>
        <Button
          title="Steps"
          type={selectedMetric === 'steps' ? 'solid' : 'outline'}
          onPress={() => setSelectedMetric('steps')}
          containerStyle={styles.metricButton}
        />
        <Button
          title="Heart Rate"
          type={selectedMetric === 'heartRate' ? 'solid' : 'outline'}
          onPress={() => setSelectedMetric('heartRate')}
          containerStyle={styles.metricButton}
        />
        <Button
          title="Sleep"
          type={selectedMetric === 'sleep' ? 'solid' : 'outline'}
          onPress={() => setSelectedMetric('sleep')}
          containerStyle={styles.metricButton}
        />
      </View>

      <Card>
        <Card.Title>{selectedMetric.toUpperCase()} - Weekly Overview</Card.Title>
        <LineChart
          data={getChartData()}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>

      <Card containerStyle={styles.statsCard}>
        <Card.Title>Daily Stats</Card.Title>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Today's {selectedMetric}:</Text>
          <Text style={styles.statValue}>
            {mockHealthData[selectedMetric][6]}
            {selectedMetric === 'steps' ? ' steps' : selectedMetric === 'heartRate' ? ' bpm' : ' hours'}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Weekly Average:</Text>
          <Text style={styles.statValue}>
            {Math.round(
              mockHealthData[selectedMetric].reduce((a, b) => a + b) /
                mockHealthData[selectedMetric].length
            )}
            {selectedMetric === 'steps' ? ' steps' : selectedMetric === 'heartRate' ? ' bpm' : ' hours'}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  connectionCard: {
    marginTop: 15,
  },
  metricButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  metricButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
});
