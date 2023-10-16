import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { Text, TextInput, RadioButton, Chip } from 'react-native-paper';
import Background from '../components/BackgroundPublic'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import StartScreen from './StartScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isTokenExpired } from '../utils/isAuth';
import { getMyImages } from '../api/images';
import BackgroundPrivate from '../components/BackgroundPrivate';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';

export default function Home({ navigation }) {

  const [myData, setMyData] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const isTokenExp = await isTokenExpired();
        if (!isTokenExp) {
          const myInfo = await getMyImages();
          const authorInfo = myInfo[0].author;
          setMyData(myInfo);
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

  const artisticStyles = [
    'abstractionism',
    'classicism',
    'cubism',
    'expressionism',
    'impressionism',
    'minimalism',
    'pop-art',
    'realism',
    'renaissance',
    'surrealism',
  ];

  return (
    <BackgroundPrivate>
      <Header>Hello{authorDetails ? `, ${authorDetails.firstname}!` : ", art enthusiast!"}</Header>
      <Paragraph style={styles.text}>
        Unleash Your Inner Artist: Create captivating artwork in various styles with ease.
      </Paragraph>
      <View style={styles.helpContainer}>
        <Paragraph>🤔 Need Assistance? </Paragraph>
        <TouchableOpacity onPress={() => navigation.navigate('Help')}>
          <View>
            <MaterialCommunityIcons name="help-circle-outline" color={theme.colors.secondary} size={36} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>Describe your idea (required):</Text>
        <TextInput
          label="Your idea"
          mode='outlined'
          multiline={true}
        /* value={text}
        onChangeText={text => setText(text)} */
        />
      </View>
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>Choose an artistic style (required):</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setSelectedStyle(newValue)}
          value={selectedStyle}
        >
          <View style={styles.chipContainer}>
            {artisticStyles.map((style, index) => (
              <View key={index} style={styles.chipWrapper}>
                <RadioButton.Item
                  label={style}
                  value={style}
                  status={selectedStyle === style ? 'checked' : 'unchecked'}
                  /* color={selectedStyle === style ? theme.colors.primary : theme.colors.secondary} */
                  labelStyle={{ fontSize: 15, color: theme.colors.text }}
                  style={styles.radioButton}
                  onPress={() => setSelectedStyle(style)}
                />
              </View>
            ))}
          </View>
        </RadioButton.Group>
      </View>
    </BackgroundPrivate>
  );
}

const styles = StyleSheet.create({
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  container: {
    marginVertical: 10
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10
  },
    chipWrapper: {
      marginRight: 5,
      marginBottom: 5,
    },
  radioButton: {
    /*     height: 40, */
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.secondary, // Color for the unselected border
  },
  text: {
    textAlign: 'left',
  },
  messageSuccess: {
    color: 'green',
  },
  messageError: {
    color: 'red',
  },
})