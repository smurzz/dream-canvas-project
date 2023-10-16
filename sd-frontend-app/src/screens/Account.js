import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import TextInput from '../components/TextInput';
import { logout } from '../api/auth'
import { View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Modal, Portal } from 'react-native-paper';
import { getUserByEmail, updateUser } from '../api/user'
import { nameValidator } from '../helpers/nameValidator'
import { confirmPassValidator, newPassValidator, oldPassValidator } from '../helpers/changePasswordValidator'
import BackgroundPrivate from '../components/BackgroundPrivate'
import { isTokenExpired } from '../utils/isAuth';
import { theme } from '../core/theme';

export default function Account({ navigation }) {

  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [firstname, setFirstname] = useState({ value: '', error: '' });
  const [lastname, setLastname] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [confirmedPassword, setConfirmedPassword] = useState({ value: '', error: '' });
  const [updateStatus, setUpdateStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  /* Get user data */
  useEffect(() => {
    async function fetchUserByEmail() {
      try {
        const isTokenExp = await isTokenExpired();
        var email = JSON.parse(await AsyncStorage.getItem("email"));
        if (!isTokenExp) {
          const user = await getUserByEmail(email);
          if (user) {
            setUser(user);
            if (user.firstname && user.lastname) {
              setFirstname({ value: user.firstname, error: '' });
              setLastname({ value: user.lastname, error: '' });
            } else {
              setFirstname({ value: '', error: '' });
              setLastname({ value: '', error: '' });
            }
          }
        } else {
          navigation.navigate('StartScreen');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUserByEmail();
  }, []);

  /* Update user's firstname,lastname or password */
  const onSavePressed = async () => {
    const firstnameError = nameValidator(firstname.value);
    const lastnameError = nameValidator(lastname.value);
    const oldPasswordError = oldPassValidator(password.value);
    const newPasswordError = newPassValidator(password.value, newPassword.value);
    const confirmPasswordError = confirmPassValidator(password.value, newPassword.value, confirmedPassword.value);

    if (oldPasswordError || newPasswordError || confirmPasswordError || firstnameError || lastnameError) {
      setFirstname({ ...firstname, error: firstnameError });
      setLastname({ ...lastname, error: lastnameError });
      setPassword({ ...password, error: oldPasswordError });
      setNewPassword({ ...newPassword, error: newPasswordError });
      setConfirmedPassword({ ...confirmedPassword, error: confirmPasswordError });
      return;
    }
    setUpdateStatus({ status: null, message: '' });
    setLoading(true);
    try {
      const response = await updateUser(
        user.id,
        firstname.value,
        lastname.value,
        password.value,
        newPassword.value,
        confirmedPassword.value
      );

      if (response.status === 200) {
        setPassword({ value: '', error: '' });
        setNewPassword({ value: '', error: '' });
        setConfirmedPassword({ value: '', error: '' });
        setUpdateStatus({ status: 'success', message: 'Changes successfully saved!' });
      } else {
        setUpdateStatus({ status: 'error', message: response.error });
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        setUpdateStatus({ status: 'error', message: error.response.data.error });
      } else {
        setUpdateStatus({ status: 'error', message: 'Update failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  /* Logout */
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

  /* Delete user account */
  // ToDo

  return (
    user ? (
      <BackgroundPrivate>
        <View>
          {updateStatus.status === 'success' && (
            <Text style={styles.messageSuccess}>{updateStatus.message}</Text>
          )}

          {updateStatus.status === 'error' && (
            <Text style={styles.messageError}>{updateStatus.message}</Text>
          )}
          <Header>Personal details</Header>
          <TextInput
            label="First name"
            returnKeyType="next"
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            value={firstname.value}
            onChangeText={(text) => setFirstname({ value: text, error: '' })}
            error={!!firstname.error}
            errorText={firstname.error}
            editable={!loading}
          />
          <TextInput
            label="Last name"
            returnKeyType="next"
            value={lastname.value}
            autoCapitalize="none"
            autoCompleteType="family-name"
            textContentType="familyName"
            keyboardType="default"
            onChangeText={(text) => setLastname({ value: text, error: '' })}
            error={!!lastname.error}
            errorText={lastname.error}
            editable={!loading}
          />
        </View>
        <View>
          <Header>Password</Header>
          <TextInput
            label="Old password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            label="New password"
            returnKeyType="done"
            value={newPassword.value}
            onChangeText={(text) => setNewPassword({ value: text, error: '' })}
            error={!!newPassword.error}
            errorText={newPassword.error}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            label="Confirm password"
            returnKeyType="done"
            value={confirmedPassword.value}
            onChangeText={(text) => setConfirmedPassword({ value: text, error: '' })}
            error={!!confirmedPassword.error}
            errorText={confirmedPassword.error}
            secureTextEntry
            editable={!loading}
          />
        </View>
        <View>
          <Button
            mode="outlined"
            onPress={onSavePressed}
          >
            Save
          </Button>
        </View>
        <View>
          <Header>Delete account</Header>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
              <Header>Are you sure you want to delete your account?</Header>
              <Paragraph style={{ textAlign: 'left' }}>This action is irreversible and will result in the permanent
                deletion of all your personal information, as well as all the images you've created. Once deleted, this data cannot
                be recovered.</Paragraph>
              <Button
                mode="outlined"
                style={styles.deleteButton}
                textColor="red"
                onPress={hideModal}
              >
                Delete
              </Button>
              <Button
                mode="outlined"
                onPress={hideModal}
              >
                Cancel
              </Button>
            </Modal>
          </Portal>
          <Button
            mode="outlined"
            style={styles.deleteButton}
            textColor="red"
            onPress={showModal}
          >
            Delete my account
          </Button>
        </View>
        <View>
          <Button
            mode="outlined"
            onPress={onLogoutPressed}
          >
            Logout
          </Button>
        </View>
      </BackgroundPrivate>

    ) : (
      <ActivityIndicator size="small" color={theme.colors.primary} />
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    /* paddingHorizontal: 20, */
    paddingBottom: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30
  },
  deleteButton: {
    borderColor: "red",
    textColor: "red"
  },
  messageSuccess: {
    color: 'green',
  },
  messageError: {
    color: 'red',
  },
});