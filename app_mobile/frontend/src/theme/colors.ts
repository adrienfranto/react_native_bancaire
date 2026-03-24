// Core Brand Colors
export const Brand = {
  emerald50: '#ECFDF5',
  emerald500: '#10B981',
  emerald600: '#059669',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
};

export const LightTheme = {
  primary: Brand.emerald500,
  primaryDark: Brand.emerald600,
  primaryLight: Brand.emerald50,
  accent: Brand.indigo500,
  accentLight: '#EEF2FF',
  background: Brand.slate100,
  backgroundAlt: Brand.slate50,
  card: '#FFFFFF',
  textPrimary: Brand.slate900,
  textSecondary: Brand.slate600,
  textMuted: Brand.slate400,
  textLight: '#CBD5E1',
  // Gradient headers
  gradientStart: '#0F172A',
  gradientEnd: '#1E3A5F',

  // Warning states
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  
  // Legacy & Utility aliases
  slate50: Brand.slate50,
  slate100: Brand.slate100,
  slate200: Brand.slate200,
  slate300: Brand.slate300,
  slate400: Brand.slate400,
  slate500: Brand.slate500,
  slate600: Brand.slate600,
  slate700: Brand.slate700,
  slate800: Brand.slate800,
  slate900: Brand.slate900,
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  danger: '#EF4444',
  success: Brand.emerald500,
  border: Brand.slate200,
  borderLight: Brand.slate100,
  dangerBorder: 'rgba(239, 68, 68, 0.2)',
};

export const DarkTheme = {
  primary: Brand.emerald500,
  primaryDark: Brand.emerald600,
  primaryLight: 'rgba(16, 185, 129, 0.1)',
  accent: Brand.indigo500,
  accentLight: 'rgba(99, 102, 241, 0.1)',
  background: Brand.slate900,
  backgroundAlt: '#0A0F1D',
  card: Brand.slate800,
  textPrimary: '#FFFFFF',
  textSecondary: Brand.slate400,
  textMuted: '#64748B',
  textLight: '#475569',
  border: 'rgba(255,255,255,0.1)',
  danger: '#EF4444',
  success: Brand.emerald500,
  glassWhite: 'rgba(255, 255, 255, 0.05)',
  glassCard: 'rgba(30, 41, 59, 0.8)',
  shadowPrimary: 'rgba(16, 185, 129, 0.4)',
  shadowAccent: 'rgba(99, 102, 241, 0.4)',
  shadowDanger: 'rgba(239, 68, 68, 0.4)',

  // Gradient headers (keep dark for contrast)
  gradientStart: '#0F172A',
  gradientEnd: '#020617',

  // Warning states
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  
  // Slate aliases (inverted or dark-appropriate)
  slate50: '#0F172A',
  slate100: '#1E293B',
  slate200: 'rgba(255,255,255,0.1)',
  slate300: '#334155',
  slate400: Brand.slate400,
  slate500: '#CBD5E1',
  slate600: '#F1F5F9',
  slate700: '#F8FAFC',
  slate800: '#F8FAFC',
  slate900: '#FFFFFF',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  borderLight: 'rgba(255,255,255,0.05)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',
};

export const Colors = LightTheme;
export default Colors;
