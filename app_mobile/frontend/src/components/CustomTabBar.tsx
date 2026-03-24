import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Dashboard: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  List: { active: 'wallet', inactive: 'wallet-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  Dashboard: 'Tableau',
  List: 'Prêts',
  Profile: 'Profil',
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8, backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
        const label = TAB_LABELS[route.name] || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconPill, isFocused && { backgroundColor: theme.primaryLight }]}>
              <Ionicons
                name={isFocused ? icons.active : icons.inactive}
                size={22}
                color={isFocused ? theme.primary : theme.textMuted}
              />
            </View>
            <Text style={[styles.tabText, isFocused ? { color: theme.primary, fontWeight: '700' } : { color: theme.textMuted }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: Brand.slate900,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 25,
    paddingTop: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconPill: {
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  tabText: {
    color: Brand.slate400,
    fontWeight: '600',
    fontSize: 11,
  },
  tabTextFocused: {
    color: Brand.emerald500,
    fontWeight: '700',
  },
});
