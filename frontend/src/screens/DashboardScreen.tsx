import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { calculateTotals } from '../utils/calculations';
import { PretContext } from '../context/PretContext';
import { Ionicons } from '@expo/vector-icons';
import { DashboardChart } from '../components/DashboardChart';
import { Colors, Brand, LightTheme, DarkTheme } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ActivityIndicator } from 'react-native';

export const DashboardScreen: React.FC = () => {
  const { prets, loading, error } = useContext(PretContext);
  const { user } = useAuth();
  const { isDarkMode, theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Chargement de vos finances...</Text>
      </View>
    );
  }

  const { total, min, max } = calculateTotals(prets);
  const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

  const dynamicStyles = {
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    text: { color: theme.textPrimary },
    textMuted: { color: theme.textSecondary },
    border: { borderColor: theme.border },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.headerBackground}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: isDarkMode ? '#fff' : '#fff' }]}>Bonjour, {user?.nom.split(' ')[0] || 'Adrien'}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: isDarkMode ? Brand.emerald500 : Brand.emerald500 }]} />
                <Text style={styles.subtitle}>Votre santé financière est stable</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarWrapper}>
              {user?.photo_profil_url ? (
                <Image 
                  source={{ uri: `${API_BASE_URL}${user.photo_profil_url}` }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Balance Card Overlap */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Total des dettes</Text>
              <Text style={styles.balanceValue}>{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</Text>
            </View>
            <View style={styles.balanceAction}>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsBtnText}>Détails</Text>
                <Ionicons name="chevron-forward" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, dynamicStyles.container]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {prets.length === 0 ? (
            <View style={[styles.emptyState, dynamicStyles.card]}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="analytics-outline" size={48} color={isDarkMode ? Brand.emerald500 : Colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, dynamicStyles.text]}>Démarrer votre gestion</Text>
              <Text style={[styles.emptyText, dynamicStyles.textMuted]}>Ajoutez vos premiers prêts bancaires pour visualiser vos analyses financières en temps réel.</Text>
              <TouchableOpacity style={styles.emptyActionBtn}>
                <Text style={styles.emptyActionText}>Ajouter un prêt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DashboardChart total={total} min={min} max={max} />
          )}

          {/* Additional Insight Card */}
          <View style={[styles.insightCard, dynamicStyles.card, dynamicStyles.border]}>
            <View style={[styles.insightIcon, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="bulb-outline" size={20} color={theme.warning} />
            </View>
            <View style={styles.insightText}>
              <Text style={[styles.insightTitle, dynamicStyles.text]}>Conseil du jour</Text>
              <Text style={[styles.insightDesc, dynamicStyles.textMuted]}>Rembourser les prêts avec un taux supérieur à 4% en priorité pour réduire vos intérêts totaux.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ActivityIndicator moved to top

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate100,
  },
  headerBackground: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 110, // Reduced from 150 for better spacing
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 30, // Reduced from 60 for compactness
  },
  greeting: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)', // Glass Emerald stronger
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
    position: 'absolute',
    bottom: -90,// Deep positioning
    marginTop: 100,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  balanceInfo: {
    
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
  },
  balanceAction: {},
  detailsBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 60, // Adjusted from 100 for more compact header
    paddingBottom: 110,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.slate500,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  emptyActionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyActionText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  insightCard: {
    backgroundColor: '#fff',
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: { flex: 1 },
  insightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    color: Colors.slate500,
    lineHeight: 18,
    fontWeight: '500',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: Colors.slate500, fontWeight: '600' },
});
