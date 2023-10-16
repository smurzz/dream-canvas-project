import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Background from './BackgroundPublic'
import Logo from './Logo'
import Header from './Header'
import Paragraph from './Paragraph'
import Button from './Button'
import Home from '../screens/Home';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContent } from './DrawerContent';
import { getMyImages } from '../api/images';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isTokenExpired } from '../utils/isAuth';
import Account from '../screens/Account';
import Album from '../screens/Album';
import { HelpPage } from '../screens';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
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
        component={HelpPage}
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