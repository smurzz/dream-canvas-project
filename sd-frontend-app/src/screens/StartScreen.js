import React from 'react'
import BackgroundPublic from '../components/BackgroundPublic'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <BackgroundPublic>
      <Logo />
      <Header>DreamCanvas</Header>
      <Paragraph>
        Welcome to Dream Canvas: Where Your Creative Journey Begins!
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </BackgroundPublic>
  )
}