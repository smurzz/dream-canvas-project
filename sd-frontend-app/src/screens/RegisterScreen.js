import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import BackgroundPublic from '../components/BackgroundPublic';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';

import { register } from '../api/auth';

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState({ value: '', error: '' });
  const [lastname, setLastname] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [registrationStatus, setRegistrationStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  const onSignUpPressed = async () => {
    const firstnameError = nameValidator(firstname.value);
    const lastnameError = nameValidator(lastname.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || firstnameError || lastnameError) {
      setFirstname({ ...firstname, error: firstnameError });
      setLastname({ ...lastname, error: lastnameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setRegistrationStatus({ status: null, message: '' });
    setLoading(true);
    try {
      const response = await register(firstname.value, lastname.value, email.value, password.value);

      if (response.status === 200) {
        setFirstname({ value: '', error: '' });
        setLastname({ value: '', error: '' });
        setEmail({ value: '', error: '' });
        setPassword({ value: '', error: '' });
        setRegistrationStatus({ status: 'success', message: 'Registration successful! Now you can login.' });
      } else {
        setRegistrationStatus({ status: 'error', message: response.error });
      }
    } catch (error) {
      setRegistrationStatus({ status: 'error', message: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <BackgroundPublic>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      {registrationStatus.status === 'success' && (
        <Text style={styles.messageSuccess}>{registrationStatus.message}</Text>
      )}

      {registrationStatus.status === 'error' && (
        <Text style={styles.messageError}>{registrationStatus.message}</Text>
      )}
      <TextInput
        label="Firstname (optional)"
        returnKeyType="next"
        value={firstname.value}
        onChangeText={(text) => setFirstname({ value: text, error: '' })}
        error={!!firstname.error}
        errorText={firstname.error}
        editable={!loading}
      />
      <TextInput
        label="Lastname (optional)"
        returnKeyType="next"
        value={lastname.value}
        onChangeText={(text) => setLastname({ value: text, error: '' })}
        error={!!lastname.error}
        errorText={lastname.error}
        editable={!loading}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        editable={!loading}
      />
      {loading && (<ActivityIndicator size="small" color={theme.colors.primary} />)}
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        disabled={loading}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </BackgroundPublic>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  messageSuccess: {
    color: 'green',
  },
  messageError: {
    color: 'red',
  },
})
