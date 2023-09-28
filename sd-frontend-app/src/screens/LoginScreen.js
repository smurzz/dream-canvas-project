import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';

import { login } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loginStatus, setLoginStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setLoginStatus({ status: null, message: '' });
    setLoading(true);
    try {
      const response = await login(email.value, password.value);

      if (response.status === 200) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      } else {
        console.log(response);
        setLoginStatus({ status: 'error', message: response.data.error });
      }
    } catch (error) {
      console.log(error.response);
      if(error.response.status === 400 || error.response.status === 404){
        setLoginStatus({ status: 'error', message: error.response.data.error });
      } else {
        setLoginStatus({ status: 'error', message: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Login</Header>
      {loginStatus.status === 'error' && (
        <Text style={styles.messageError}>{loginStatus.message}</Text>
      )}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        editable={!loading}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        editable={!loading}
        secureTextEntry
      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      {loading && (<ActivityIndicator size="small" color={theme.colors.primary} />)}
      <Button mode="contained" onPress={onLoginPressed} disabled={loading}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  /* forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  }, */
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  messageError: {
    color: 'red',
  },
})
