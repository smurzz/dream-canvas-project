import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Home from './Home';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContent } from '../components/DrawerContent';
import { getMyImages } from '../api/images';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isTokenExpired } from '../utils/isAuth';
import Account from './Account';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function Dashboard({ navigation }) {

  const [ userInfo, setUserInfo ] = useState(null);
  const [ authorDetails, setAuthorDetails ] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const isTokenExp = await isTokenExpired();
        if(!isTokenExp) {
          const myInfo = await getMyImages();
          console.log(myInfo);
          const authorInfo = myInfo[0].author;
          setUserInfo(myInfo);
          setAuthorDetails(authorInfo);
        } else {
          navigation.navigate('StartScreen');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchUserInfo();
  }, []);

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
        component={Home}
        options={{
          tabBarLabel: 'Album',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="image-album" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={(props) => <Account {...props} author={authorDetails} />}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}


{/* 
    <Drawer.Navigator drawerContent={() => <DrawerContent />} initialRouteName="HomeScreen">
      <Drawer.Screen name="HomeScreen" component={ Home } />
    </Drawer.Navigator>
*/}