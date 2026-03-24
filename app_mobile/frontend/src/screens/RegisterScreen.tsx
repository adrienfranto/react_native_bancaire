import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

interface Props {
  onGoToLogin: () => void;
}

export const RegisterScreen: React.FC<Props> = ({ onGoToLogin }) => {
  const { register, loading } = useAuth();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!nom || !email || !password || !confirm) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    try {
      await register(nom.trim(), email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <LinearGradient
      colors={['#fff', Colors.slate50, '#E0F2FE']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onGoToLogin} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={Colors.slate900} />
              </TouchableOpacity>
              <View style={styles.titleGroup}>
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez la simplicité financière</Text>
              </View>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom complet</Text>
                <View style={[styles.inputContainer, nom && styles.inputActive]}>
                  <Ionicons name="person-outline" size={20} color={nom ? Colors.primary : Colors.slate400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Jean Dupont"
                    placeholderTextColor={Colors.slate300}
                    value={nom}
                    onChangeText={setNom}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Adresse email</Text>
                <View style={[styles.inputContainer, email && styles.inputActive]}>
                  <Ionicons name="mail-outline" size={20} color={email ? Colors.primary : Colors.slate400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="exemple@email.fr"
                    placeholderTextColor={Colors.slate300}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={[styles.inputContainer, password && styles.inputActive]}>
                  <Ionicons name="lock-closed-outline" size={20} color={password ? Colors.primary : Colors.slate400} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Min. 6 caractères"
                    placeholderTextColor={Colors.slate300}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.slate400} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={[
                  styles.inputContainer, 
                  confirm && styles.inputActive,
                  confirm && confirm !== password && { borderColor: Colors.danger }
                ]}>
                  <Ionicons 
                    name="shield-checkmark-outline" 
                    size={20} 
                    color={confirm ? (confirm === password ? Colors.primary : Colors.danger) : Colors.slate400} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Répétez votre mot de passe"
                    placeholderTextColor={Colors.slate300}
                    secureTextEntry={!showPassword}
                    value={confirm}
                    onChangeText={setConfirm}
                  />
                </View>
                {confirm && confirm !== password ? (
                  <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
                ) : null}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Créer mon compte</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={onGoToLogin}>
                  <Text style={styles.footerLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  titleGroup: { flex: 1 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.slate900, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: Colors.slate500, fontWeight: '500', marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 30,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.slate700, marginBottom: 10, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  inputActive: {
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.slate900, paddingVertical: 14, fontWeight: '500' },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 6, marginLeft: 6, fontWeight: '600' },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { color: Colors.slate500, fontSize: 15, fontWeight: '500' },
  footerLink: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
});
