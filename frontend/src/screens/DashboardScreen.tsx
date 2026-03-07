import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { calculateTotals } from '../utils/calculations';
import { PretContext } from '../context/PretContext';
import { Ionicons } from '@expo/vector-icons';
import { DashboardChart } from '../components/DashboardChart';

export const DashboardScreen: React.FC = () => {
  const { prets, loading, error } = useContext(PretContext);

  if (loading) {
    return <SafeAreaView style={styles.center}><Text>Chargement...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={styles.center}><Text style={styles.errorText}>Erreur: {error}</Text></SafeAreaView>;
  }

  const { total, min, max } = calculateTotals(prets);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, Adrien</Text>
            <Text style={styles.subtitle}>Voici votre résumé financier</Text>
          </View>
          <Ionicons name="person-circle" size={48} color="#1E3A8A" />
        </View>

        {prets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={60} color="#CBD5E1" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>Aucune donnée</Text>
            <Text style={styles.emptyText}>Ajoutez des prêts pour voir s'afficher vos statistiques.</Text>
          </View>
        ) : (
          <DashboardChart total={total} min={min} max={max} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  }
});
