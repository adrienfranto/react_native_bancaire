import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Platform } from 'react-native';
import { MainNavigator } from './src/navigation/MainNavigator';
import { PretProvider } from './src/context/PretContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Root app content — conditionally shows Login/Register or the Main app
const AppContent = () => {
  const { user, initializing } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Show spinner while restoring session from AsyncStorage
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!user) {
    if (showRegister) {
      return <RegisterScreen onGoToLogin={() => setShowRegister(false)} />;
    }
    return <LoginScreen onGoToRegister={() => setShowRegister(true)} />;
  }

  return (
    <PretProvider>
      <MainNavigator />
    </PretProvider>
  );
};

/** StatusBar intelligente : translucide sur Android, synchronisée au thème */
const AppStatusBar: React.FC = () => {
  const { isDarkMode } = useTheme();
  return (
    <StatusBar
      style={isDarkMode ? 'light' : 'light'} // toujours 'light' car le header est un gradient sombre
      translucent={Platform.OS === 'android'}
      backgroundColor="transparent"
    />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppStatusBar />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
