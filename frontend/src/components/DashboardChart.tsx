import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

interface Props {
  total: number;
  min: number;
  max: number;
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bgColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, color, bgColor }) => (
  <View style={styles.kpiCard}>
    <View style={[styles.kpiIcon, { backgroundColor: bgColor, shadowColor: color }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={[styles.kpiValue, { color }]}>{value}</Text>
  </View>
);

export const DashboardChart: React.FC<Props> = ({ total, min, max }) => {
  const { theme, isDarkMode } = useTheme();

  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => isDarkMode ? `rgba(16, 185, 129, ${opacity})` : `rgba(16, 185, 129, ${opacity})`,
    strokeWidth: 2,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
  };

  const data = [
    {
      name: 'Min',
      population: Math.max(min, 0.01),
      color: Brand.emerald500,
      legendFontColor: isDarkMode ? Brand.slate400 : Brand.slate600,
      legendFontSize: 11,
    },
    {
      name: 'Max',
      population: Math.max(max, 0.01),
      color: theme.danger,
      legendFontColor: theme.textSecondary,
      legendFontSize: 11,
    },
    {
      name: 'Total',
      population: Math.max(total, 0.01),
      color: theme.accent,
      legendFontColor: theme.textSecondary,
      legendFontSize: 11,
    },
  ];

  const fmt = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <View style={[styles.container, { backgroundColor: theme.card, shadowColor: isDarkMode ? '#000' : Brand.slate900 }]}>
      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Résumé financier</Text>
        <View style={[styles.sectionBadge, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="stats-chart" size={14} color={theme.primary} />
          <Text style={[styles.sectionBadgeText, { color: theme.primary }]}>Live</Text>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <KpiCard
          label="Total"
          value={fmt(total)}
          icon="trending-up"
          color={theme.accent}
          bgColor={theme.accentLight}
        />
        <KpiCard
          label="Minimal"
          value={fmt(min)}
          icon="arrow-down-circle"
          color={Brand.emerald500}
          bgColor={isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)'}
        />
        <KpiCard
          label="Maximal"
          value={fmt(max)}
          icon="arrow-up-circle"
          color={theme.danger}
          bgColor={theme.dangerLight}
        />
      </View>

      {/* Pie chart */}
      {total > 0 && (
        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={Dimensions.get('window').width - 64}
            height={140}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Brand.slate50,
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.slate900,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.emerald50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.emerald500,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 0,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Brand.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  chartContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
