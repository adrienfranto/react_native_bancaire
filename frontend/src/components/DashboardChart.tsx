import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface Props {
  total: number;
  min: number;
  max: number;
}

export const DashboardChart: React.FC<Props> = ({ total, min, max }) => {
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const data = [
    {
      name: 'Min',
      population: Math.max(min, 0),
      color: '#10B981', // Emerald 500
      legendFontColor: '#475569',
      legendFontSize: 14,
    },
    {
      name: 'Max',
      population: Math.max(max, 0),
      color: '#EF4444', // Red 500
      legendFontColor: '#475569',
      legendFontSize: 14,
    },
    {
      name: 'Total',
      population: Math.max(total, 0),
      color: '#3B82F6', // Blue 500
      legendFontColor: '#475569',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé des Montants à Payer</Text>
      
      <View style={styles.textSummary}>
        <Text style={styles.textLine}>Total à payer: {total.toFixed(2)}€</Text>
        <Text style={styles.textLine}>Minimal à payer: {min.toFixed(2)}€</Text>
        <Text style={styles.textLine}>Maximal à payer: {max.toFixed(2)}€</Text>
      </View>

      {total > 0 && (
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          absolute
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1E293B',
  },
  textSummary: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  textLine: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  }
});
