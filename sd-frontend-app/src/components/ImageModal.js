import React, { useState, useCallback } from 'react';
import { Alert, Image, Modal, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Paragraph from './Paragraph';
import { theme } from '../core/theme';
import Header from './Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteGeneratedImageById } from '../api/images';
import { CameraRoll, } from '@react-native-camera-roll/camera-roll';

export default function ImageModal({ navigation, visible, setIsVisible, selectedImage }) {

    const deletePhoto = useCallback(() => {
        Alert.alert('Do you want to delete this image?', '', [
            {
                isPreferred: true,
                text: 'Yes',
                onPress: async () => {
                    try {
                        const response = await deleteGeneratedImageById(selectedImage.id);
                        if (response.status === 204) {
                            Alert.alert('Image deleted');
                            setIsVisible(() => !visible);
                        } else {
                            Alert.alert('Image not deleted');
                        }
                    } catch (error) {
                        Alert.alert('Image not deleted');
                        if (error.response && error.response.status === 404) {
                            console.log(error.response.data.error);
                        } else {
                            console.log('Delete failed. Please try again.' );
                        }
                    }
                },
                style: 'default',
            },
            {
                isPreferred: false,
                text: 'No',
                onPress: () => { },
                style: 'destructive',
            },
        ]);
    }, []);

    const savePhoto = useCallback(() => {
        Alert.alert('Do you want to save this image?', '', [
            {
                isPreferred: true,
                text: 'Yes',
                onPress: async () => {
                    const res = await CameraRoll.save(selectedImage.url);
                    console.log(res);
                    if (res) {
                        Alert.alert('Image saved');
                    }
                },
                style: 'default',
            },
            {
                isPreferred: false,
                text: 'No',
                onPress: () => { },
                style: 'destructive',
            },
        ]);
    }, []);

    return (
        <Modal visible={visible} transparent={true} style={styles.modalContainer}>
            <TouchableOpacity
                onPress={() => setIsVisible(() => !visible)}
                style={styles.modalBackground}
            >
                <Header style={{ color: theme.colors.secondary }}>{selectedImage.style}</Header>
                <Image
                    style={styles.modalImage}
                    source={{ uri: selectedImage.url }}
                />
                <Paragraph style={{ color: theme.colors.secondary }}>{selectedImage.idea}</Paragraph>
                <MaterialCommunityIcons
                    name="delete"
                    style={styles.deleteIconContainer}
                    color={theme.colors.tabInactive}
                    size={32}
                    onPress={deletePhoto}
                />
                <MaterialCommunityIcons
                    name="download"
                    style={styles.saveIconContainer}
                    color={theme.colors.tabInactive}
                    size={32}
                    onPress={() => savePhoto()}
                />
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        aspectRatio: 1,
    },
    deleteIconContainer: {
        position: 'absolute',
        bottom: 32,
        right: 32,
    },
    saveIconContainer: {
        position: 'absolute',
        bottom: 32,
        left: 32,
    },
});