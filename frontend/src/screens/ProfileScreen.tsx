import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Platform } from 'react-native';
import { Brand } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    user?.photo_profil_url ? `${API_BASE_URL}${user.photo_profil_url}` : null
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "Autorisez l'accès à la galerie dans les paramètres.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user) return;
    setUploading(true);

    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const blobRes = await fetch(uri);
        const blob = await blobRes.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        formData.append('file', blob, `photo.${ext}`);
      } else {
        const filename = uri.split('/').pop() || 'photo.jpg';
        // @ts-ignore
        formData.append('file', { uri, name: filename, type: 'image/jpeg' });
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/upload-profile-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      setProfileImageUrl(`${API_BASE_URL}${data.photo_profil_url}?t=${Date.now()}`);
      Alert.alert('✅ Succès', 'Photo de profil mise à jour !');
    } catch (error: any) {
      Alert.alert('Erreur upload', error.message || "L'upload a échoué.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const dynamicStyles = {
    container: { backgroundColor: theme.background },
    card: { backgroundColor: theme.card },
    text: { color: theme.textPrimary },
    textMuted: { color: theme.textSecondary || theme.textMuted },
    separator: { backgroundColor: theme.border || 'rgba(255,255,255,0.05)' },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={styles.headerBackground}
        >
          <SafeAreaView>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Mon Profil</Text>
              <TouchableOpacity style={styles.logoutBtnTop} onPress={logout}>
                <Ionicons name="power" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={[styles.profileCard, dynamicStyles.card]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarPinner, { borderColor: theme.card }]}>
                {profileImageUrl ? (
                  <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{user.nom.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                {uploading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator color={theme.primary} />
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.editBadge} onPress={pickImage} disabled={uploading}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.userName, dynamicStyles.text]}>{user.nom}</Text>
            <Text style={[styles.userEmail, dynamicStyles.textMuted]}>{user.email}</Text>
            
            <View style={styles.tag}>
              <Text style={styles.tagText}>CLIENT PRIVILÈGE</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={[styles.actionsCard, dynamicStyles.card]}>
            <TouchableOpacity style={styles.actionRow} onPress={toggleTheme}>
              <View style={[styles.actionIconWrapper, { backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : theme.accentLight }]}>
                <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={isDarkMode ? "#A5B4FC" : theme.accent} />
              </View>
              <Text style={[styles.actionText, dynamicStyles.text]}>Mode {isDarkMode ? 'Sombre' : 'Clair'}</Text>
              <View style={[styles.toggleTrack, { backgroundColor: isDarkMode ? theme.primary : Brand.slate200 }]}>
                <View style={[styles.toggleThumb, { transform: [{ translateX: isDarkMode ? 14 : 0 }] }]} />
              </View>
            </TouchableOpacity>

            <View style={[styles.separator, dynamicStyles.separator]} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={[styles.actionIconWrapper, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="settings-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.actionText, dynamicStyles.text]}>Paramètres du compte</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            <View style={[styles.separator, dynamicStyles.separator]} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.actionText, dynamicStyles.text]}>Sécurité & Confidentialité</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            <View style={[styles.separator, dynamicStyles.separator]} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={[styles.actionIconWrapper, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="notifications-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.actionText, dynamicStyles.text]}>Notifications</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Autre</Text>
          <View style={[styles.actionsCard, dynamicStyles.card]}>
            <TouchableOpacity style={styles.actionRow} onPress={logout}>
              <View style={[styles.actionIconWrapper, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : theme.slate100 }]}>
                <Ionicons name="log-out-outline" size={20} color={theme.danger} />
              </View>
              <Text style={[styles.actionText, { color: theme.danger }]}>Déconnexion</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>Version 1.2.0 • VenotFinance Secure</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.slate50 },
  scrollContent: { paddingBottom: 110 },
  headerBackground: { 
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 80, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  logoutBtnTop: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 12, borderRadius: 16,
  },
  content: { paddingHorizontal: 24 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 28,
    paddingTop: 0,
    alignItems: 'center',
    marginTop: -50,
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 10,
    marginBottom: 28,
  },
  avatarContainer: { marginTop: -60, position: 'relative', marginBottom: 20 },
  avatarPinner: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 6, borderColor: '#fff',
    backgroundColor: Brand.slate50,
    overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Brand.slate900, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 15,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { 
    width: '100%', height: '100%', 
    backgroundColor: Brand.emerald50,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { fontSize: 36, fontWeight: '900', color: Brand.emerald500 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center', alignItems: 'center',
  },
  editBadge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: Brand.emerald500,
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  userName: { fontSize: 22, fontWeight: '900', color: Brand.slate900, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Brand.slate500, fontWeight: '600', marginBottom: 12 },
  tag: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10,
  },
  tagText: { fontSize: 10, fontWeight: '800', color: Brand.indigo600, letterSpacing: 1 },
  sectionTitle: {
    fontSize: 14, fontWeight: '800', color: Brand.slate400,
    textTransform: 'uppercase', letterSpacing: 1,
    marginLeft: 10, marginBottom: 12, marginTop: 12,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Brand.slate900, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16,
  },
  actionIconWrapper: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: '700' },
  separator: { height: 1, marginLeft: 72 },
  versionText: {
    textAlign: 'center', fontSize: 12, color: Brand.slate400,
    marginTop: 10, fontWeight: '500',
  },
});
