import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { PretBancaire } from '../models/Pret';
import { calculateMontantAPayer } from '../utils/calculations';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  prets: PretBancaire[];
  onEdit: (pret: PretBancaire) => void;
  onDelete: (id: number) => void;
}

const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const formatDateFr = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const j = jours[d.getUTCDay() || 0];
  const m = mois[d.getUTCMonth()];
  return `${j} le ${d.getUTCDate()} ${m} ${d.getUTCFullYear()}`;
};

export const PretList: React.FC<Props> = ({ prets, onEdit, onDelete }) => {
  const renderItem = ({ item }: { item: PretBancaire }) => {
    const aPayer = calculateMontantAPayer(item);
    const dateFormatee = formatDateFr(item.date_pret);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>{item.nom_client}</Text>
          <View style={styles.badgeBanque}>
            <Text style={styles.badgeText}>{item.nom_banque}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date :</Text>
          <Text style={styles.value}>{dateFormatee}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Compte :</Text>
          <Text style={styles.value}>{item.n_compte}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Emprunté :</Text>
          <Text style={styles.value}>{item.montant} €</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Taux :</Text>
          <Text style={styles.value}>{(item.taux_pret * 100).toFixed(2)} %</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.aPayerLabel}>Total à rembourser</Text>
          <Text style={styles.aPayerValue}>{aPayer.toFixed(2)} €</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(item)} style={[styles.actionBtn, styles.editBtn]}>
            <Ionicons name="pencil" size={16} color="#333" style={{ marginRight: 6 }} />
            <Text style={styles.btnText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionBtn, styles.deleteBtn]}>
            <Ionicons name="trash-outline" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
            <Text style={[styles.btnText, { color: '#D32F2F' }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={prets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={50} color="#ccc" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Aucun prêt enregistré</Text>
          <Text style={styles.emptySubtext}>Appuyez sur le bouton + pour en ajouter un.</Text>
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clientName: {
    fontWeight: '800',
    fontSize: 20,
    color: '#1a1a1a',
  },
  badgeBanque: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#757575',
    fontWeight: '500',
    fontSize: 14,
  },
  value: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  aPayerLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  aPayerValue: {
    fontWeight: '900',
    color: '#D32F2F',
    fontSize: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  btnText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#757575',
    textAlign: 'center',
  }
});
