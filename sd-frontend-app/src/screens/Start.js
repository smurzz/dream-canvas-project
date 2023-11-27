import React from 'react'
import BackgroundPublic from '../components/BackgroundPublic'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function Start({ navigation }) {
  return (
    <BackgroundPublic>
      <Logo />
      <Header>DreamCanvas</Header>
      <Paragraph>
        Welcome to Dream Canvas: Where Your Creative Journey Begins!
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Register')}
      >
        Sign Up
      </Button>
    </BackgroundPublic>
  )
}
