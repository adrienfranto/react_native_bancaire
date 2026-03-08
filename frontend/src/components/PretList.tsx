import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { PretBancaire } from '../models/Pret';
import { calculateMontantAPayer } from '../utils/calculations';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

interface Props {
  prets: PretBancaire[];
  onEdit: (pret: PretBancaire) => void;
  onDelete: (id: number) => void;
}

const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const mois = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

const formatDateFr = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getUTCDate()} ${mois[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

// Generate a consistent accent color based on bank name
const LIGHT_BANK_COLORS = [Brand.emerald500, Brand.indigo500, '#F59E0B', '#EC4899', '#06B6D4'];
const DARK_BANK_COLORS = [Brand.emerald500, Brand.indigo500, '#FBBF24', '#F472B6', '#22D3EE'];
const bankColor = (name: string, isDarkMode: boolean) => {
  const colors = isDarkMode ? DARK_BANK_COLORS : LIGHT_BANK_COLORS;
  return colors[name.charCodeAt(0) % colors.length];
};

interface ListItemProps {
  item: PretBancaire;
  index: number;
  onEdit: (pret: PretBancaire) => void;
  onDelete: (id: number) => void;
  theme: any;
  isDarkMode: boolean;
}

const AnimatedListItem: React.FC<ListItemProps> = ({ item, index, onEdit, onDelete, theme, isDarkMode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Staggered effect
      useNativeDriver: true,
    }).start();
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const aPayer = calculateMontantAPayer(item);
  const dateFormatee = formatDateFr(item.date_pret);
  const accentColor = bankColor(item.nom_banque, isDarkMode);

  return (
    <Animated.View style={[
      styles.card, 
      { 
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.9)',
        borderLeftColor: accentColor, 
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <View style={[styles.clientAvatar, { backgroundColor: accentColor + '20' }]}>
            <Text style={[styles.clientInitial, { color: accentColor }]}>
              {item.nom_client.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={[styles.clientName, { color: theme.textPrimary }]}>{item.nom_client}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={11} color={theme.textMuted} />
              <Text style={[styles.dateText, { color: theme.textMuted }]}>{dateFormatee}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.badgeBanque, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>{item.nom_banque}</Text>
        </View>
      </View>

      {/* Info Grid */}
      <View style={[styles.infoGrid, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : Brand.slate50, borderColor: theme.border }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>N° Compte</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{item.n_compte}</Text>
          </View>
          <View style={[styles.infoSeparator, { backgroundColor: theme.border }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Montant Initial</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{item.montant.toLocaleString('fr-FR')} Ar</Text>
          </View>
          <View style={[styles.infoSeparator, { backgroundColor: theme.border }]} />
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Taux Fixe</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{(item.taux_pret * 100).toFixed(2)} %</Text>
          </View>
        </View>
      </View>

      {/* Footer: Montant à payer */}
      <View style={[styles.footer, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)', borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)' }]}>
        <Text style={[styles.footerLabel, { color: theme.primary }]}>MONTANT À REBOURSER (CAPITAL + INTÉRÊTS)</Text>
        <Text style={[styles.footerValue, { color: theme.primary }]}>{aPayer.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={[styles.actionBtn, styles.editBtn, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
          <Ionicons name="create-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.editBtnText, { color: theme.textSecondary }]}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: theme.dangerLight, borderColor: theme.dangerBorder }]}>
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
          <Text style={[styles.deleteBtnText, { color: theme.danger }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

import { calculateTotals } from '../utils/calculations';

export const PretList: React.FC<Props> = ({ prets, onEdit, onDelete }) => {
  const totals = calculateTotals(prets);
  const { theme, isDarkMode } = useTheme();

  const renderFooter = () => {
    if (prets.length === 0) return null;
    return (
      <View style={[styles.footerSummary, { backgroundColor: isDarkMode ? theme.card : theme.backgroundAlt, borderColor: isDarkMode ? 'transparent' : theme.border, borderWidth: isDarkMode ? 0 : 1 }]}>
        <View style={styles.summaryHeader}>
          <Ionicons name="stats-chart" size={20} color={theme.primary} />
          <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>Bilan Global des Prêts</Text>
        </View>
        
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryItem, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : theme.card, borderColor: isDarkMode ? theme.border : theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total à rembourser</Text>
            <Text style={[styles.summaryValue, { color: theme.danger }]}>
              {totals.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
            </Text>
          </View>
          
          <View style={[styles.summarySubGrid, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : theme.background, borderColor: theme.border, borderWidth: isDarkMode ? 0 : 1 }]}>
            <View style={styles.summaryItemSmall}>
              <Text style={[styles.summaryLabelSmall, { color: theme.textMuted }]}>Minimum</Text>
              <Text style={[styles.summaryValueSmall, { color: theme.textPrimary }]}>{totals.min.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</Text>
            </View>
            <View style={[styles.summarySeparator, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItemSmall}>
              <Text style={[styles.summaryLabelSmall, { color: theme.textMuted }]}>Maximum</Text>
              <Text style={[styles.summaryValueSmall, { color: theme.textPrimary }]}>{totals.max.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: PretBancaire, index: number }) => (
    <AnimatedListItem 
      item={item} 
      index={index} 
      onEdit={onEdit} 
      onDelete={onDelete} 
      theme={theme} 
      isDarkMode={isDarkMode} 
    />
  );

  return (
    <FlatList
      data={prets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconWrapper, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="folder-open-outline" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.emptyText, { color: theme.textPrimary }]}>Aucun prêt enregistré</Text>
          <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>Appuyez sur le bouton + pour en ajouter un.</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 24, // Rounder corners
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 8, // Thicker accent
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientInitial: {
    fontSize: 18,
    fontWeight: '900',
  },
  clientName: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.slate900,
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 12,
    color: Brand.slate400,
    fontWeight: '500',
  },
  badgeBanque: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoGrid: {
    backgroundColor: Brand.slate50,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Brand.slate200,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSeparator: {
    width: 1,
    height: '60%',
    backgroundColor: Brand.slate200,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Brand.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.slate800,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Brand.emerald500,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  footerValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Brand.emerald500,
  },
  footerSummary: {
    backgroundColor: Brand.slate900,
    borderRadius: 28,
    padding: 24,
    marginTop: 10,
    marginBottom: 40,
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  summaryGrid: {
    gap: 20,
  },
  summaryItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  summarySubGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
  },
  summaryItemSmall: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabelSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: Brand.slate500,
    marginBottom: 4,
  },
  summaryValueSmall: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  summarySeparator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editBtn: {
    backgroundColor: Brand.slate50,
    borderWidth: 1,
    borderColor: Brand.slate200,
  },
  editBtnText: {
    color: Brand.slate600,
    fontWeight: '700',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteBtnText: {
    color: Brand.slate900,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Brand.emerald50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.slate900,
    marginBottom: 6,
  },
  emptySubtext: {
    color: Brand.slate400,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
