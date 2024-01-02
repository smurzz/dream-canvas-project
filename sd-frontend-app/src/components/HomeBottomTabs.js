import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Account from '../screens/Account';
import Album from '../screens/Album';
import { Help } from '../screens';
import HomeTopTabs from './HomeTopTabs';
import { theme } from '../core/theme';

const Tab = createMaterialBottomTabNavigator();

export default function HomeBottomTabs() {

  return (
    <Tab.Navigator
      initialRouteName="HomeTopTabs"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.tabInactive}
    >
      <Tab.Screen
        name="Home"
        component={HomeTopTabs}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Album"
        component={Album}
        options={{
          tabBarLabel: 'Album',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="image-album" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={Help}
        options={{
          tabBarLabel: 'Help',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="help" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}