import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Today: '📅',
    Tracking: '📊',
    Library: '📚',
    Profile: '👤',
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name]}</Text>
      <Text
        style={{
          fontSize: 10,
          color: focused ? '#3b82f6' : '#9ca3af',
          marginTop: 2,
        }}
      >
        {name}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 12,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          title: 'Today',
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          title: 'Tracking',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'Food Library',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
