import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const STORAGE_KEY = '@venot_user';

interface User {
  id: number;
  nom: string;
  email: string;
  photo_profil_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // restoring session?

  // On app launch, restore user from AsyncStorage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to restore session', e);
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const saveUser = async (u: User) => {
    setUser(u);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Erreur de connexion');
      }
      const data = await res.json();
      await saveUser(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (nom: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur d'inscription");
      }
      const data = await res.json();
      await saveUser(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};


