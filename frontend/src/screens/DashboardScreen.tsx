import React, { useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Platform, ScrollView, Animated } from 'react-native';
import { calculateTotals } from '../utils/calculations';
import { PretContext } from '../context/PretContext';
import { Ionicons } from '@expo/vector-icons';
import { DashboardChart } from '../components/DashboardChart';
import { Brand, LightTheme, DarkTheme } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ActivityIndicator } from 'react-native';
import { BASE_URL } from '../services/api';

export const DashboardScreen: React.FC = () => {
  const { prets, loading, error } = useContext(PretContext);
  const { user } = useAuth();
  const { isDarkMode, theme } = useTheme();

  const isWeb = Platform.OS === 'web';
  const fadeAnim = useRef(new Animated.Value(isWeb ? 1 : 1)).current; // Default to 1 for visibility
  const slideAnim = useRef(new Animated.Value(isWeb ? 0 : 0)).current;  // Default to 0
  const scaleAnim = useRef(new Animated.Value(isWeb ? 1 : 1)).current;  // Default to 1
  const chartFadeAnim = useRef(new Animated.Value(isWeb ? 1 : 1)).current; // Default to 1

  useEffect(() => {
    if (isWeb) return; // Skip animations on web for instant visibility

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(chartFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, chartFadeAnim, isWeb]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Chargement de vos finances...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background, padding: 20 }]}>
        <Ionicons name="cloud-offline-outline" size={60} color={theme.danger} />
        <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Erreur de connexion</Text>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { total, min, max } = calculateTotals(prets);

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
        colors={[theme.gradientStart, theme.primary, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: isDarkMode ? '#fff' : '#fff' }]}>Bienvenue, {user?.nom.split(' ')[0] || 'Adrien'}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: isDarkMode ? Brand.emerald500 : Brand.emerald500 }]} />
                <Text style={styles.subtitle}>Votre santé financière est stable</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarWrapper}>
              {user?.photo_profil_url ? (
                <Image 
                  source={{ uri: `${BASE_URL}${user.photo_profil_url}` }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name="person" size={24} color={theme.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Balance Card Overlap */}
          <Animated.View style={[
            styles.balanceCard,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.95)',
              borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            }
          ]}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Total des dettes</Text>
              <Text style={styles.balanceValue}>{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</Text>
            </View>
            <View style={styles.balanceAction}>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsBtnText}>Détails</Text>
                <Ionicons name="chevron-forward" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
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
                <Ionicons name="analytics-outline" size={48} color={isDarkMode ? Brand.emerald500 : theme.primary} />
              </View>
              <Text style={[styles.emptyTitle, dynamicStyles.text]}>Démarrer votre gestion</Text>
              <Text style={[styles.emptyText, dynamicStyles.textMuted]}>Ajoutez vos premiers prêts bancaires pour visualiser vos analyses financières en temps réel.</Text>
              <TouchableOpacity style={styles.emptyActionBtn}>
                <Text style={styles.emptyActionText}>Ajouter un prêt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            isWeb ? (
              <DashboardChart total={total} min={min} max={max} />
            ) : (
              <Animated.View style={{ opacity: chartFadeAnim }}>
                <DashboardChart total={total} min={min} max={max} />
              </Animated.View>
            )
          )}

          
        </View>
      </ScrollView>
    </View>
  );
};

// ActivityIndicator moved to top

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.slate50,
  },
  headerBackground: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 40, 
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    zIndex: 10,
    overflow: 'visible', // Ensure overlap is visible
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 20, // Reduced space,
    
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
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
    backgroundColor: Brand.emerald500,
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
    backgroundColor: 'rgba(16, 185, 129, 0.95)', 
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    zIndex: 20,
    marginBottom: -20, // Use negative margin for overlap instead of top/bottom
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
    paddingTop: 60, // Space for the overlapping card
    paddingBottom: 110,
    zIndex: 1,
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
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Brand.emerald50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Brand.slate900,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: Brand.slate400,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  emptyActionBtn: {
    backgroundColor: Brand.emerald500,
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
    borderColor: Brand.slate200,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Brand.emerald50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: { flex: 1 },
  insightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.slate900,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    color: Brand.slate500,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorTitle: { fontSize: 22, fontWeight: '900', marginTop: 16, marginBottom: 8 },
  errorText: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#fff', fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: Brand.slate500, fontWeight: '600' },
});
