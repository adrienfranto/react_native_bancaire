import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

interface Props {
  onGoToRegister: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onGoToRegister }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.slate50, Colors.slate100, '#E0F2FE']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            
            {/* Logo / Header */}
            <View style={styles.logoContainer}>
              <View style={styles.logoOuter}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.logoCircle}
                >
                  <Ionicons name="business" size={44} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>VenotFinance</Text>
              <View style={styles.taglineBadge}>
                <Text style={styles.tagline}>Gérez vos intérêts avec clarté</Text>
              </View>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Bon retour !</Text>
                <Text style={styles.cardSubtitle}>Connectez-vous pour continuer</Text>
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
                    placeholder="••••••••"
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

              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotPassText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Se connecter</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Nouveau ici ? </Text>
                <TouchableOpacity onPress={onGoToRegister}>
                  <Text style={styles.footerLink}>Créer un compte</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomNote}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.slate400} />
              <Text style={styles.bottomNoteText}>Connexion sécurisée SSL 256-bit</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoOuter: {
    padding: 6,
    borderRadius: 45,
    backgroundColor: '#fff',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 16,
  },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  appName: { fontSize: 32, fontWeight: '900', color: Colors.slate900, letterSpacing: -1 },
  taglineBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagline: { fontSize: 13, color: Colors.slate500, fontWeight: '600' },
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
  cardHeader: { marginBottom: 24 },
  cardTitle: { fontSize: 24, fontWeight: '900', color: Colors.slate900, marginBottom: 4 },
  cardSubtitle: { fontSize: 15, color: Colors.slate500, fontWeight: '500' },
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
  forgotPass: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPassText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 6,
  },
  bottomNoteText: { fontSize: 11, color: Colors.slate400, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
});
