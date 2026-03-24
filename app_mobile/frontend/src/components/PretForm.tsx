import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PretBancaire, PretBancaireCreate } from '../models/Pret';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onAdd: (pret: PretBancaireCreate) => void;
  onUpdate: (id: number, pret: PretBancaireCreate) => void;
  pretToEdit?: PretBancaire | null;
  onCancelEdit: () => void;
}

interface FieldProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  children: React.ReactNode;
}

const FormField: React.FC<FieldProps> = ({ label, icon, children }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={14} color={theme.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      {children}
    </View>
  );
};

export const PretForm: React.FC<Props> = ({ onAdd, onUpdate, pretToEdit, onCancelEdit }) => {
  const { theme, isDarkMode } = useTheme();
  const [nCompte, setNCompte] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [nomBanque, setNomBanque] = useState('');
  const [montant, setMontant] = useState('');
  const [datePret, setDatePret] = useState('');
  const [tauxPret, setTauxPret] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    setDatePret(new Date().toISOString().split('T')[0]);
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={[styles.headerIcon, { backgroundColor: theme.primaryLight }]}>
            <Ionicons
              name={pretToEdit ? 'create-outline' : 'add-circle-outline'}
              size={22}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {pretToEdit ? 'Modifier le prêt' : 'Nouveau prêt'}
          </Text>
        </View>

        <FormField label="N° de Compte" icon="card-outline">
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundAlt, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="Ex: FR76 3000..."
            value={nCompte}
            onChangeText={setNCompte}
            placeholderTextColor={theme.textLight}
          />
        </FormField>

        <FormField label="Nom du Client" icon="person-outline">
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundAlt, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="Ex: Jean Dupont"
            value={nomClient}
            onChangeText={setNomClient}
            placeholderTextColor={theme.textLight}
          />
        </FormField>

        <FormField label="Établissement Bancaire" icon="business-outline">
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundAlt, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="Ex: BNP Paribas"
            value={nomBanque}
            onChangeText={setNomBanque}
            placeholderTextColor={theme.textLight}
          />
        </FormField>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <FormField label="Montant (Ar)" icon="cash-outline">
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundAlt, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="10 000"
                keyboardType="numeric"
                value={montant}
                onChangeText={setMontant}
                placeholderTextColor={theme.textLight}
              />
            </FormField>
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="Taux (ex: 0.05)" icon="trending-up-outline">
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundAlt, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="0.05"
                keyboardType="numeric"
                value={tauxPret}
                onChangeText={setTauxPret}
                placeholderTextColor={theme.textLight}
              />
            </FormField>
          </View>
        </View>

        <FormField label="Date du prêt" icon="calendar-outline">
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={{
                border: `1.5px solid ${theme.border}`,
                backgroundColor: theme.backgroundAlt,
                padding: '13px 14px',
                borderRadius: '14px',
                fontSize: '16px',
                color: theme.textPrimary,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              value={datePret}
              onChange={(e: any) => setDatePret(e.target.value)}
            />
          ) : (
            <>
              {/* Bouton affichant la date — ouvre le calendrier Android au tap */}
              <TouchableOpacity
                style={[styles.input, styles.dateTouchable, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.75}
              >
                <Ionicons name="calendar" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: datePret ? theme.textPrimary : theme.textLight, fontSize: 16, fontWeight: '600' }}>
                  {datePret
                    ? new Date(datePret).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                    : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>

              {/* Calendrier natif Android */}
              {showDatePicker && (
                <DateTimePicker
                  value={datePret ? new Date(datePret) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    setShowDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      // Format YYYY-MM-DD
                      const yyyy = selectedDate.getFullYear();
                      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const dd = String(selectedDate.getDate()).padStart(2, '0');
                      setDatePret(`${yyyy}-${mm}-${dd}`);
                    }
                  }}
                />
              )}
            </>
          )}
        </FormField>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} onPress={handleSubmit}>
            <Ionicons name={pretToEdit ? 'checkmark' : 'add'} size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>{pretToEdit ? 'Mettre à jour' : 'Ajouter le prêt'}</Text>
          </TouchableOpacity>

          {pretToEdit && (
            <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]} onPress={onCancelEdit}>
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Annuler</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 4 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Brand.emerald50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Brand.slate900,
    letterSpacing: -0.3,
  },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.slate600,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Brand.slate200,
    backgroundColor: Brand.slate50,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    fontSize: 16,
    color: Brand.slate900,
  },
  buttonContainer: { marginTop: 8, gap: 10 },
  submitBtn: {
    backgroundColor: Brand.emerald500,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Brand.emerald500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cancelBtn: {
    backgroundColor: Brand.slate50,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Brand.slate200,
  },
  cancelBtnText: { color: Brand.slate600, fontSize: 16, fontWeight: '700' },
});
