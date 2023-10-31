import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native'
import { Text, RadioButton, Chip, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundPrivate from '../components/BackgroundPrivate';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import ImageRadioButton from '../components/ImageRadioButton';
import { isTokenExpired } from '../utils/isAuth';
import { getUserByEmail } from '../api/user';
import { generateImage } from '../api/images';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import { promptValidator, styleValidator } from '../helpers/imageGenerationValidator';
import artistsInfo from '../helpers/artistsInfo';

const { width, height } = Dimensions.get('screen');

export default function Home({ navigation }) {
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
  const [authorDetails, setAuthorDetails] = useState(null);
  const [artists, setArtists] = useState([]);
  const [resultImageUrl, setResultImageUrl] = useState('');

  const [prompt, setPrompt] = useState({ value: '', error: '' });
  const [selectedStyle, setSelectedStyle] = useState({ value: '', error: '' });
  const [selectedArtist, setSelectedArtist] = useState(null);

  const [generateImageStatus, setGenerateImageStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  /* Get user data (first name) for greeting */
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const isTokenExp = await isTokenExpired();
        var email = JSON.parse(await AsyncStorage.getItem("email"));
        if (!isTokenExp) {
          const authorInfo = await getUserByEmail(email);
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

  /* Set artists array depending on an artistic style */
  useEffect(() => {
    setSelectedArtist(null);

    switch (selectedStyle.value) {
      case "abstractionism":
        setArtists(artistsInfo.abstract);
        break;
      case "classicism":
        setArtists(artistsInfo.classic);
        break;
      case "cubism":
        setArtists(artistsInfo.cubism);
        break;
      case "expressionism":
        setArtists(artistsInfo.express);
        break;
      case "impressionism":
        setArtists(artistsInfo.impress);
        break;
      case "minimalism":
        setArtists(artistsInfo.minimal);
        break;
      case "pop-art":
        setArtists(artistsInfo.popart);
        break;
      case "realism":
        setArtists(artistsInfo.realism);
        break;
      case "renaissance":
        setArtists(artistsInfo.renaiss);
        break;
      case "surrealism":
        setArtists(artistsInfo.surreal);
        break;
      default:
        setArtists([]);
        break;
    }
  }, [selectedStyle.value]);

  /* Generate image by idea, artistic art and artist */
  const onGeneratePressed = async () => {
    const promptError = promptValidator(prompt.value);
    const styleError = styleValidator(selectedStyle.value);

    if (promptError || styleError) {
      setPrompt({ ...prompt, error: promptError });
      setSelectedStyle({ ...selectedStyle, error: styleError });
      return;
    }
    setGenerateImageStatus({ status: null, message: '' });
    setResultImageUrl('');
    setLoading(true);
    try {
      const response = await generateImage(prompt.value, selectedStyle.value, selectedArtist);

      if (response.status === 201 && response.data) {
        const base64url = `data:${response.data.generatedImage.type};base64,${response.data.generatedImage.data}`;
        setResultImageUrl(base64url);
        console.log(base64url);

        setPrompt({ value: '', error: '' });
        setSelectedStyle({ value: '', error: '' });
        setSelectedArtist(null);
        setGenerateImageStatus({ status: 'success', message: 'Your image is ready!' });
      } else {
        setGenerateImageStatus({ status: 'error', message: response.error });
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        setGenerateImageStatus({ status: 'error', message: error.response.data.error });
      } else {
        setGenerateImageStatus({ status: 'error', message: 'Generation failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <BackgroundPrivate>
      <Header>Hello{(authorDetails && authorDetails.firstname) ? `, ${authorDetails.firstname}!` : ", art enthusiast!"}</Header>
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
          value={prompt.value}
          keyboardType="default"
          onChangeText={(text) => setPrompt({ value: text, error: '' })}
          error={!!prompt.error}
          errorText={prompt.error}
          editable={!loading}
        />
      </View>
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>Choose an artistic style (required):</Text>
        <RadioButton.Group
          onValueChange={value => { setSelectedStyle({ value: value, error: '' }) }}
          value={selectedStyle.value} >
          <View style={styles.chipContainer}>
            {artisticStyles.map((style, index) => (
              <View key={index} style={styles.chipWrapper}>
                <View style={styles.labelRadioContainer}>
                  <Text>{style}</Text>
                  <RadioButton.Android
                    value={style}
                    label={style}
                    status={selectedStyle === style ? 'checked' : 'unchecked'}
                    disabled={loading} />
                </View>
              </View>
            ))}
          </View>
        </RadioButton.Group>
        {selectedStyle.error && (<Text style={styles.messageError}>{selectedStyle.error}</Text>)}
      </View>
      {selectedStyle.value && (<View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>Choose an artist style (optional):</Text>
        <View style={styles.artistsContainer}>
          <View style={styles.radioButtonContainer}>
            {artists.map((artist, index) => (
              <ImageRadioButton
                key={index}
                artist={artist}
                onPress={() => setSelectedArtist(artist.name)}
                selected={selectedArtist === artist.name}
                loading={loading}
              />
            ))}
          </View>
        </View>
      </View>
      )}
      {loading && (<View style={styles.loadingContainer}>
        <Text style={styles.text}>Generating image... It can take some time.</Text>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      </View>)}
      {generateImageStatus.status === 'success' && (
        <View style={styles.container}>
          <Text style={styles.messageSuccess}>{generateImageStatus.message}</Text>
          <Image
            source={{ uri: resultImageUrl }}
            style={{ width: '100%', height: 400 }}
          />
        </View>
      )}
      {generateImageStatus.status === 'error' && (
        <Text style={styles.messageError}>{generateImageStatus.message}</Text>
      )}
      <Button
        mode="contained"
        onPress={onGeneratePressed}
        style={{ marginTop: 24 }}
        disabled={loading}
      >
        Generate
      </Button>
    </BackgroundPrivate>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  artistsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRadioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  chipWrapper: {
    marginRight: 5,
    marginBottom: 5,
  },
  text: {
    textAlign: 'left',
  },
  radioButton: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  radioButtonContainer: {
    width: width * 0.9,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  messageSuccess: {
    color: 'green',
  },
  messageError: {
    color: 'red',
  },
})