import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import { PretList } from '../components/PretList';
import { PretForm } from '../components/PretForm';
import { PretContext } from '../context/PretContext';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { CustomModal } from '../components/CustomModal';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export const ListScreen: React.FC = () => {
  const { prets, deletePret, addPret, updatePret, loading, error } = useContext(PretContext);
  const { theme, isDarkMode } = useTheme();

  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pretToEdit, setPretToEdit] = useState<PretBancaire | null>(null);
  const [pretToDeleteId, setPretToDeleteId] = useState<number | null>(null);

  // Form Handlers
  const handleOpenAdd = () => {
    setPretToEdit(null);
    setFormModalVisible(true);
  };

  const handleOpenEdit = (pret: PretBancaire) => {
    setPretToEdit(pret);
    setFormModalVisible(true);
  };

  const handleSubmitForm = async (pretData: PretBancaireCreate) => {
    if (pretToEdit) {
      await updatePret(pretToEdit.id, pretData);
    } else {
      await addPret(pretData);
    }
    setFormModalVisible(false);
    setPretToEdit(null);
  };

  const handleCancelForm = () => {
    setFormModalVisible(false);
    setPretToEdit(null);
  };

  // Delete Handlers
  const handleOpenDelete = (id: number) => {
    setPretToDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (pretToDeleteId !== null) {
      await deletePret(pretToDeleteId);
    }
    setDeleteModalVisible(false);
    setPretToDeleteId(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setPretToDeleteId(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Portefeuille</Text>
            <View style={styles.subtitleRow}>
              <View style={[styles.countBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.countText, { color: theme.primary }]}>{prets.length}</Text>
              </View>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Prêts actifs</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.iconContainer, { shadowColor: theme.primary }]} activeOpacity={0.7} onPress={handleOpenAdd}>
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              style={styles.headerAddBtn}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <PretList 
          prets={prets} 
          onEdit={handleOpenEdit} 
          onDelete={handleOpenDelete} 
        />

        {/* Floating Action Button */}
        <TouchableOpacity style={[styles.fab, { shadowColor: theme.primary }]} onPress={handleOpenAdd} activeOpacity={0.9}>
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Form Modal (Add / Edit) */}
        <CustomModal visible={isFormModalVisible} onClose={handleCancelForm}>
          <PretForm 
            onAdd={handleSubmitForm} 
            onUpdate={(_, data) => handleSubmitForm(data)} 
            pretToEdit={pretToEdit}
            onCancelEdit={handleCancelForm}
          />
        </CustomModal>

        {/* Custom Delete Confirmation Modal */}
        <CustomModal visible={isDeleteModalVisible} onClose={handleCancelDelete}>
          <View style={styles.deleteModalContainer}>
            <View style={[styles.warningIconWrapper, { backgroundColor: theme.dangerLight }]}>
              <Ionicons name="warning-outline" size={36} color={theme.danger} />
            </View>
            <Text style={[styles.deleteModalTitle, { color: theme.textPrimary }]}>Confirmation</Text>
            <Text style={[styles.deleteModalText, { color: theme.textSecondary }]}>Voulez-vous vraiment supprimer ce prêt ? Cette action est irréversible.</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]} onPress={handleCancelDelete}>
                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: theme.danger }]} onPress={handleConfirmDelete}>
                <Text style={styles.confirmBtnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.slate100,
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
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Brand.slate900,
    letterSpacing: -1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  countBadge: {
    backgroundColor: Brand.emerald50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countText: {
    color: Brand.emerald500,
    fontWeight: '800',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Brand.slate500,
    fontWeight: '600',
  },
  iconContainer: {
    shadowColor: Brand.emerald500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  headerAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    shadowColor: Brand.emerald500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  warningIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    color: Brand.slate900,
  },
  deleteModalText: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    color: Brand.slate500,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontWeight: '800',
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
