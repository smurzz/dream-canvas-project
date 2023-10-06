import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import StartScreen from './StartScreen'
import TextInput from '../components/TextInput';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { logout } from '../api/auth'
import { View, Text } from 'react-native'

export default function Account({ navigation, author }) {

  const onLogoutPressed = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      });
    } catch (error) {
      throw error;
    }
  }

  return (
    <Background>
      {author ? (<View>
        <Header>Settings</Header>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={author.email}
          editable={false}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="First name"
          returnKeyType="next"
          value={author.firstname}
          editable={true}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
        />
        <TextInput
          label="Last name"
          returnKeyType="next"
          value={author.lastname}
          editable={true}
          autoCapitalize="none"
          autoCompleteType="family-name"
          textContentType="familyName"
          keyboardType="default"
        />
        <Button
          mode="outlined"
          onPress={onLogoutPressed}
        >
          Logout
        </Button>
      </View>) : (
        <Text>Loading user information...</Text>
      )}
    </Background>
  );
}