import React, { useEffect, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import { Text, RadioButton, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundPrivate from '../components/BackgroundPrivate';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import ImageRadioButton from '../components/ImageRadioButton';
import { isTokenExpired } from '../utils/isAuth';
import { getUserByEmail } from '../api/user';
import { generateImg2ImageSDAPI, generateTxt2ImageSDAPI } from '../api/images';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';
import { promptValidator, styleValidator } from '../helpers/imageGenerationValidator';
import artistsInfo from '../helpers/artistsInfo';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getMyModel } from '../api/model';

const { width, height } = Dimensions.get('screen');

export default function Generate({ navigation }) {
  const isFocused = useIsFocused();

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
  const [myModel, setMymodel] = useState(null);
  const [modelStatus, setModelStatus] = useState(false);
  const [artists, setArtists] = useState([]);
  const [useMyModel, setUseMyModel] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [prompt, setPrompt] = useState({ value: '', error: '' });
  const [selectedStyle, setSelectedStyle] = useState({ value: '', error: '' });
  const [selectedArtist, setSelectedArtist] = useState(null);

  const [generateImageStatus, setGenerateImageStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  /* Get user data (first name) for greeting */
  const fetchUserInfo = useCallback(async () => {
    try {
      const isTokenExp = await isTokenExpired();
      var email = JSON.parse(await AsyncStorage.getItem("email"));
      if (!isTokenExp) {
        const authorInfo = await getUserByEmail(email);
        setAuthorDetails(authorInfo);
      } else {
        navigation.navigate('Start');
      }
    } catch (error) {
      console.log('Error fetching user info: ', error);
    }
  }, [navigation]);

  /* Get my model */
  const fetchModelInfo = useCallback(async () => {
    try {
      const isTokenExp = await isTokenExpired();
      if (!isTokenExp) {
        const modelData = await getMyModel();
        setMymodel(modelData);
        setModelStatus(modelData.status === "ready");
      } else {
        navigation.navigate('Start');
      }
    } catch (error) {
      console.log('Error fetching model info:', error);
    }
  }, [navigation]);

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

  /* Clean generated image by screen visiting */
  useEffect(() => {
    fetchUserInfo();
    fetchModelInfo();
    setGenerateImageStatus({ status: null, message: '' });
    setResultImageUrl('');
    setUploadedImage(null);
    setUploadedImageUrl('');
  }, [isFocused, fetchUserInfo, fetchModelInfo]);

  /* Reload data by refreshing */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchUserInfo();
      await fetchModelInfo();
      setRefreshing(false);
    }, 2000);
  }, [fetchUserInfo]);

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
    setUploadedImage(null);
    setUploadedImageUrl('');
    setLoading(true);
    try {
      var response;
      const model_id = (myModel && useMyModel) ? myModel.sdapiModelId : null;

      if (uploadedImage) {
        response = await generateImg2ImageSDAPI(uploadedImage, prompt.value, selectedStyle.value, selectedArtist, model_id);
      } else {
        response = await generateTxt2ImageSDAPI(prompt.value, selectedStyle.value, selectedArtist, model_id);
      }

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
        console.log(error);
        setGenerateImageStatus({ status: 'error', message: 'Generation failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  /* Get uploaded image data */
  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUrl = result.assets[0].uri;
        const imageWidth = result.assets[0].width;
        const imageHeight = result.assets[0].height;

        const size = Math.min(imageWidth, imageHeight);

        const cropX = (imageWidth - size) / 2;
        const cropY = (imageHeight - size) / 2;

        const formatedImage = await ImageManipulator.manipulateAsync(
            imageUrl,
            [{ crop: { originX: cropX, originY: cropY, width: size, height: size } }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setUploadedImageUrl({ uri: imageUrl });
        setUploadedImage({
          uri: formatedImage.uri,
          type: 'image/png',
          name: 'uploaded_img2img'
        });
      }
    } catch (error) {
      console.log('Error picking an image', error);
    }
  };

  return (
    <BackgroundPrivate refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <Header>Hello{(authorDetails && authorDetails.firstname) ? `, ${authorDetails.firstname}!` : ", art enthusiast!"}</Header>
      <View style={styles.helpContainer}>
        <Paragraph>🤔 Need Assistance? </Paragraph>
        <TouchableOpacity onPress={() => navigation.navigate('Help')}>
          <View>
            <MaterialCommunityIcons name="help-circle-outline" color={theme.colors.secondary} size={36} />
          </View>
        </TouchableOpacity>
      </View>
      {/* Upload Image */}
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.colors.secondary, }])}>
        <Text variant="titleMedium" color={theme.colors.text}>Create Art from Your Photos:</Text>
        <Button
          mode="outlined"
          onPress={handleImageUpload}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          Upload Image
        </Button>
      </View>
      {uploadedImageUrl && (<View style={styles.container}>
        <Image
          source={uploadedImageUrl}
          style={{ width: '100%', height: 400 }}
        />
      </View>)}
      {/* Idea Input */}
      <View style={StyleSheet.flatten([styles.container, { alignItems: 'left' }])}>
        <Text variant="titleMedium" color={theme.colors.text}>Describe Your Image or Share Your Idea (required):</Text>
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
        {modelStatus && (<View style={styles.labelRadioContainer}>
          <Text>Use my Model</Text>
          <RadioButton.Android
            value="Use my Model"
            status={useMyModel ? 'checked' : 'unchecked'}
            onPress={() => setUseMyModel(!useMyModel)}
            accessibilityLabel="Use my model"
            accessibilityRole="radio"
            accessibilityStates={useMyModel ? ['checked'] : ['unchecked']}
          />
        </View>)}
      </View>
      {/* Artistic Style */}
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.colors.secondary, }])}>
        <Text variant="titleMedium" color={theme.colors.text}>Choose an artistic style (required):</Text>
        <RadioButton.Group
          onValueChange={value => { setSelectedStyle({ value: value, error: '' }) }}
          value={selectedStyle.value} 
          accessibilityRole="radiogroup">
          <View style={styles.chipContainer}>
            {artisticStyles.map((style, index) => (
              <View key={index} style={styles.chipWrapper}>
                <View style={styles.labelRadioContainer}>
                  <Text>{style}</Text>
                  <RadioButton.Android
                    value={style}
                    label={style}
                    status={selectedStyle === style ? 'checked' : 'unchecked'}
                    disabled={loading}
                    accessibilityLabel={style}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedStyle.value === style }}/>
                </View>
              </View>
            ))}
          </View>
        </RadioButton.Group>
        {selectedStyle.error && (<Text style={styles.messageError}>{selectedStyle.error}</Text>)}
      </View>
      {/* Artist Style */}
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
      {/* Loading */}
      {loading && (<View style={styles.loadingContainer}>
        <Text style={styles.text}>Generating image... It can take some time.</Text>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      </View>)}
      {/* Result */}
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
      {/* Generate Button */}
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
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e8eced',
    padding: 10
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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