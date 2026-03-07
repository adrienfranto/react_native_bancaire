import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onAdd: (pret: PretBancaireCreate) => void;
  onUpdate: (id: number, pret: PretBancaireCreate) => void;
  pretToEdit?: PretBancaire | null;
  onCancelEdit: () => void;
}

export const PretForm: React.FC<Props> = ({ onAdd, onUpdate, pretToEdit, onCancelEdit }) => {
  const [nCompte, setNCompte] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [nomBanque, setNomBanque] = useState('');
  const [montant, setMontant] = useState('');
  const [datePret, setDatePret] = useState('');
  const [tauxPret, setTauxPret] = useState('');

  useEffect(() => {
    if (pretToEdit) {
      setNCompte(pretToEdit.n_compte);
      setNomClient(pretToEdit.nom_client);
      setNomBanque(pretToEdit.nom_banque);
      setMontant(pretToEdit.montant.toString());
      setDatePret(pretToEdit.date_pret);
      setTauxPret(pretToEdit.taux_pret.toString());
    } else {
      clearForm();
    }
  }, [pretToEdit]);

  const clearForm = () => {
    setNCompte('');
    setNomClient('');
    setNomBanque('');
    setMontant('');
    setDatePret(new Date().toISOString().split('T')[0]); // Default to today in YYYY-MM-DD
    setTauxPret('');
  };

  const handleSubmit = () => {
    if (!nCompte || !nomClient || !nomBanque || !montant || !datePret || !tauxPret) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const pretData: PretBancaireCreate = {
      n_compte: nCompte,
      nom_client: nomClient,
      nom_banque: nomBanque,
      montant: parseFloat(montant),
      date_pret: datePret,
      taux_pret: parseFloat(tauxPret),
    };

    if (pretToEdit) {
      onUpdate(pretToEdit.id, pretData);
    } else {
      onAdd(pretData);
    }
    clearForm();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons 
          name={pretToEdit ? "create-outline" : "add-circle-outline"} 
          size={28} 
          color="#1a1a1a" 
          style={{ marginRight: 8 }} 
        />
        <Text style={styles.headerTitle}>
          {pretToEdit ? 'Modifier le Prêt' : 'Nouveau Prêt'}
        </Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>N° de Compte</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: FR76 3000..." 
          value={nCompte} 
          onChangeText={setNCompte} 
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom du Client</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Jean Dupont" 
          value={nomClient} 
          onChangeText={setNomClient} 
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Établissement Bancaire</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: BNP Paribas" 
          value={nomBanque} 
          onChangeText={setNomBanque} 
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 15 }]}>
          <Text style={styles.label}>Montant (€)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: 10000" 
            keyboardType="numeric" 
            value={montant} 
            onChangeText={setMontant} 
            placeholderTextColor="#999"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Taux (ex: 0.05)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0.05" 
            keyboardType="numeric" 
            value={tauxPret} 
            onChangeText={setTauxPret} 
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date du prêt</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              backgroundColor: '#F9FAFB',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '16px',
              color: '#333',
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            value={datePret}
            onChange={(e) => setDatePret(e.target.value)}
          />
        ) : (
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DD" 
            value={datePret} 
            onChangeText={setDatePret} 
            placeholderTextColor="#999"
          />
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>{pretToEdit ? "Mettre à jour" : "Ajouter le prêt"}</Text>
        </TouchableOpacity>

        {pretToEdit && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancelEdit}>
            <Text style={styles.cancelBtnText}>Annuler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelBtnText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
