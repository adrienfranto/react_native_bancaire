import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  // Keep local copy of the image URL to update UI after upload
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
        // On web, expo-image-picker returns a blob: URI
        // We need to fetch it and convert to a real Blob for FormData
        const blobRes = await fetch(uri);
        const blob = await blobRes.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        formData.append('file', blob, `photo.${ext}`);
      } else {
        // On native (Android/iOS), use the file path directly
        const filename = uri.split('/').pop() || 'photo.jpg';
        // @ts-ignore React Native specific file object
        formData.append('file', { uri, name: filename, type: 'image/jpeg' });
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/upload-profile-image`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type manually — browser adds boundary automatically
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      // Update avatar with cache-busting
      setProfileImageUrl(`${API_BASE_URL}${data.photo_profil_url}?t=${Date.now()}`);
      Alert.alert('✅ Succès', 'Photo de profil mise à jour !');
    } catch (error: any) {
      Alert.alert('Erreur upload', error.message || "L'upload a échoué.");
    } finally {
      setUploading(false);
    }
  };


  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>

          {/* Avatar */}
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={uploading}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="#94A3B8" />
              </View>
            )}
            {uploading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#10B981" />
              </View>
            ) : (
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{user.nom}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userIdText}>ID utilisateur : #{user.id}</Text>

          {/* Hint */}
          <View style={styles.hint}>
            <Ionicons name="information-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.hintText}>Appuyez sur votre photo pour la modifier</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="settings-outline" size={22} color="#334155" style={styles.actionIcon} />
            <Text style={styles.actionText}>Paramètres du compte</Text>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#334155" style={styles.actionIcon} />
            <Text style={styles.actionText}>Sécurité & Confidentialité</Text>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionRow} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  logoutBtn: {
    backgroundColor: '#FFEBEE',
    padding: 8, borderRadius: 12,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#ECFDF5',
  },
  avatarPlaceholder: {
    width: '100%', height: '100%', borderRadius: 55,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 55 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 55,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#10B981',
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  userName: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  userEmail: { fontSize: 15, color: '#64748B', marginBottom: 4 },
  userIdText: { fontSize: 12, color: '#CBD5E1', marginBottom: 12 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  hintText: { fontSize: 13, color: '#64748B' },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionIcon: { marginRight: 14 },
  actionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  separator: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
});
