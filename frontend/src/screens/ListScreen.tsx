import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { PretList } from '../components/PretList';
import { PretForm } from '../components/PretForm';
import { PretContext } from '../context/PretContext';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { CustomModal } from '../components/CustomModal';
import { Ionicons } from '@expo/vector-icons';

export const ListScreen: React.FC = () => {
  const { prets, deletePret, addPret, updatePret, loading, error } = useContext(PretContext);

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

  if (loading) {
    return <SafeAreaView style={styles.center}><Text>Chargement...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={styles.center}><Text style={styles.errorText}>Erreur: {error}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Portefeuille de Prêts</Text>
            <Text style={styles.subtitle}>Gérez vos encours financiers</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={28} color="#1E3A8A" />
          </View>
        </View>
        
        <PretList 
          prets={prets} 
          onEdit={handleOpenEdit} 
          onDelete={handleOpenDelete} 
        />

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleOpenAdd}>
          <Text style={styles.fabText}>+</Text>
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
            <Text style={styles.deleteModalTitle}>Confirmation</Text>
            <Text style={styles.deleteModalText}>Voulez-vous vraiment supprimer ce prêt ?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelDelete}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmDelete}>
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
    backgroundColor: '#F8FAFC', // Slate 50 background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90, // Space for CustomTabBar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A', // Slate 900
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', // Slate 500
    marginTop: 4,
    fontWeight: '500',
  },
  iconContainer: {
    backgroundColor: '#E0E7FF', // Indigo 100
    padding: 10,
    borderRadius: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    backgroundColor: '#10B981', // Emerald 500
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  deleteModalContainer: {
    alignItems: 'center',
    padding: 10,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  deleteModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Slate 100
    padding: 14,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#EF4444', // Red 500
    padding: 14,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
