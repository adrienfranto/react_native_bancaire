import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, Animated, StatusBar, Platform } from 'react-native';
import { PretList } from '../components/PretList';
import { PretForm } from '../components/PretForm';
import { PretContext } from '../context/PretContext';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { CustomModal } from '../components/CustomModal';
import { SuccessModal } from '../components/SuccessModal';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export const ListScreen: React.FC = () => {
  const { prets, deletePret, addPret, updatePret, loading, error } = useContext(PretContext);
  const { theme, isDarkMode } = useTheme();
  const screenFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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
      setSuccessMessage('Prêt modifié avec succès');
    } else {
      await addPret(pretData);
      setSuccessMessage('Prêt ajouté avec succès');
    }
    setFormModalVisible(false);
    setPretToEdit(null);
    setSuccessModalVisible(true);
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
      setSuccessMessage('Prêt supprimé avec succès');
      setDeleteModalVisible(false);
      setPretToDeleteId(null);
      setSuccessModalVisible(true);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setPretToDeleteId(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, { opacity: screenFadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Portefeuille</Text>
            <View style={styles.subtitleRow}>
              <View style={[styles.countBadge, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : theme.primaryLight }]}>
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

        <SuccessModal 
          visible={isSuccessModalVisible} 
          onClose={() => setSuccessModalVisible(false)} 
          message={successMessage} 
        />
      </Animated.View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 10 : 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28, // More compact
    fontWeight: '900',
    color: Brand.slate900,
    letterSpacing: -0.8,
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
