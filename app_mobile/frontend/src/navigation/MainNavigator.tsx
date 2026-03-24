import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ListScreen } from '../screens/ListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { CustomTabBar } from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >

        <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{ title: 'Prêts' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
    </NavigationContainer>
  );
};
