import React, { useEffect, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { RadioButton, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import BackgroundPrivate from '../components/BackgroundPrivate';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { isTokenExpired } from '../utils/isAuth';
import { theme } from '../core/theme';
import * as ImagePicker from 'expo-image-picker';

import { launchImageLibrary } from 'react-native-image-picker';
import { createModel, deleteModel, getMyModel } from '../api/model';
import { categoryValidator, selectedImagesValidator, typeValidator } from '../helpers/modelValidator';
import ConfirmationModal from '../components/ConfirmationModal';

const { width, height } = Dimensions.get('screen');

export default function MyModel({ navigation }) {
  const isFocused = useIsFocused();
  const types = ['male', 'female', 'other'];

  const [refreshing, setRefreshing] = useState(false);
  const [myModel, setMyModel] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({ value: [], error: '' });
  const [category, setCategory] = useState({ value: '', error: '' });
  const [type, setType] = useState({ value: '', error: '' });
  const [visible, setVisible] = useState(false);

  const [trainModelStatus, setTrainModelStatus] = useState({ status: null, message: '' });
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  /* Get my model */
  const fetchModelInfo = useCallback(async () => {
    try {
      const isTokenExp = await isTokenExpired();
      if (!isTokenExp) {
        const modelData = await getMyModel();
        setMyModel(modelData);
      } else {
        navigation.navigate('Start');
      }
    } catch (error) {
      console.log('Error fetching model info:', error);
    }
  }, [navigation]);

  /* Clean generated image by screen visiting */
  useEffect(() => {
    fetchModelInfo();
    setTrainModelStatus({ status: null, message: '' });
  }, [isFocused, fetchModelInfo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchModelInfo();
      setRefreshing(false);
      setTrainModelStatus({ status: null, message: '' });
    }, 2000);
  }, [fetchModelInfo]);

  /* Get uploaded images data */
  const handleImagesUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map(image => {
          return {
            uri: image.uri,
            type: image.type,
            name: image.fileName
          }
        });
        console.log(selectedImages);
        setUploadedImages({ value: selectedImages, error: '' });
      }
    } catch (error) {
      console.log('Error picking an image', error);
    }
  };

  /* Create Model button */
  const onCreatePressed = async () => {
    const categoryError = categoryValidator(category.value);
    const typeError = typeValidator(type.value);
    const selectedImagesError = selectedImagesValidator(uploadedImages.value);

    if (categoryError || typeError || selectedImagesError) {
      setCategory({ ...category, error: categoryError });
      setType({ ...type, error: typeError });
      setUploadedImages({ ...uploadedImages, error: selectedImagesError });
      return;
    }

    setTrainModelStatus({ status: null, message: '' });
    setLoading(true);
    try {
      const response = await createModel(uploadedImages.value, category.value, type.value);

      if (response.status === 201 && response.data) {
        setCategory({ value: '', error: '' });
        setType({ value: '', error: '' });
        setUploadedImages({ value: [], error: '' });
        setTrainModelStatus({ status: 'success', message: 'Your model is being processed!' });
        setMyModel(response.data);
      } else {
        setTrainModelStatus({ status: 'error', message: response.error });
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        setTrainModelStatus({ status: 'error', message: error.response.data.error });
      } else {
        console.log(error);
        setTrainModelStatus({ status: 'error', message: 'Generation failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  /* Delete model button */
  const onDeletePressed = async () => {
    try {
      const response = await deleteModel(myModel.id);

      if (response.status === 204) {
        setMyModel(null);
        hideModal();
        setTrainModelStatus({ status: 'success', message: 'Your Model is successfully deleted' });
      } else {
        setTrainModelStatus({ status: 'error', message: response.error });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTrainModelStatus({ status: 'error', message: error.response.data.error });
      } else {
        setTrainModelStatus({ status: 'error', message: 'Delete failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  const createModelForm = (
    <BackgroundPrivate refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <Header>Create Your Own Model!</Header>
      <View style={styles.helpContainer}>
        <Paragraph style={{ textAlign: 'left', }}>
          Unleash your creativity effortlessly! Transform your images—your own,
          your friend's, or even your pet's—into captivating works of art.
          Follow these steps to start your creative journey:</Paragraph>
      </View>
      {/* Upload Images */}
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>
          Pick 5-10 center-focused images (required):
        </Text>
        {uploadedImages.value.length > 0 && (
          <Paragraph style={{ textAlign: 'left', }}>You selected {uploadedImages.value.length} images.</Paragraph>
        )}
        <Button
          mode="outlined"
          onPress={handleImagesUpload}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          Upload Images
        </Button>
        {uploadedImages.error && (<Text style={styles.messageError}>{uploadedImages.error}</Text>)}
      </View>
      {/* Input Category */}
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.colors.secondary, }])}>
        <Text variant="titleMedium" color={theme.colors.text}>Specify the object category (person, cat, toy etc.) (required):</Text>
        <TextInput
          label="Category"
          mode='outlined'
          multiline={true}
          value={category.value}
          keyboardType="default"
          onChangeText={(text) => setCategory({ value: text, error: '' })}
          error={!!category.error}
          errorText={category.error}
          editable={!loading}
        />
      </View>
      {/* Choose Type */}
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>Choose the type (required):</Text>
        <RadioButton.Group
          onValueChange={value => { setType({ value: value, error: '' }) }}
          value={type.value} >
          <View style={styles.chipContainer}>
            {types.map((t, index) => (
              <View key={index} style={styles.chipWrapper}>
                <View style={styles.labelRadioContainer}>
                  <Text>{t}</Text>
                  <RadioButton.Android
                    value={t}
                    label={t}
                    status={type === t ? 'checked' : 'unchecked'}
                    disabled={loading} />
                </View>
              </View>
            ))}
          </View>
        </RadioButton.Group>
        {type.error && (<Text style={styles.messageError}>{type.error}</Text>)}
      </View>
      {/* Loading */}
      {loading && (<View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      </View>)}
      {trainModelStatus.status === 'error' && (
        <Text style={styles.messageError}>{trainModelStatus.message}</Text>
      )}
      {/* Train Model Button */}
      <Button
        mode="contained"
        onPress={onCreatePressed}
        style={{ marginTop: 24 }}
        disabled={loading}
      >
        Create Model
      </Button>
    </BackgroundPrivate>
  );

  const modelDataContainer = (
    <BackgroundPrivate refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <Header>Your Model</Header>
      {/* Success message */}
      {trainModelStatus.status === 'success' && (
        <View style={styles.container}>
          <Text style={styles.messageSuccess}>{trainModelStatus.message}</Text>
          <Text>Wait for up to 40 minutes for the magic to happen. Your model
            details will appear on the screen. Enjoy the creative journey!</Text>
        </View>
      )}
      {/* Model Data */}
      <View style={styles.container}>
        <Text variant="titleMedium" color={theme.colors.text}>
          {/*  Name: <Text>{myModel && myModel.name}</Text> */}
          <Text variant="titleMedium" color={theme.colors.text}>
            Name: <Text selectable={true}/>{myModel && myModel.name}</Text>
        </Text>
        <Text variant="titleMedium" color={theme.colors.text}>
          Category: <Text>{myModel && myModel.category}</Text>
        </Text>
        <Text variant="titleMedium" color={theme.colors.text}>
          Status: <Text>{myModel && myModel.status}</Text>
        </Text>
      </View>
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.colors.secondary, }])}>
        <Paragraph style={{ textAlign: 'left', }}>
          Once your model is <Text style={{ fontWeight: 600 }}>ready</Text>
          , start generating images based on it.
          When describing your idea, use the subject's name and your model's
          category. For example:
        </Paragraph>
        <Text>'<Text style={{ fontWeight: 600 }}>LkSde person</Text> on 5th Avenue'</Text>
        <Text>'<Text style={{ fontWeight: 600 }}>nkjrS cat</Text> looking into the camera'</Text>
      </View>
      <Button
        mode="outlined"
        style={styles.deleteButton}
        textColor="red"
        onPress={showModal}
      >
        Delete my model
      </Button>
      <ConfirmationModal
        visible={visible}
        hideModal={hideModal}
        header='Are you sure you want to delete your model?'
        paragraph='Once deleted, this data cannot be recovered.'
        onConfirmPressed={onDeletePressed}
        onCancelPressed={hideModal}
        confirmLabel='Delete'
        cancelLabel='Cancel'
      />
    </BackgroundPrivate>
  );

  return (
    myModel ? modelDataContainer : createModelForm
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
  deleteButton: {
    borderColor: "red",
    textColor: "red"
  },
})