import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { PhotoGrid } from 'react-native-photo-grid-frame';
import { isTokenExpired } from '../utils/isAuth';
import { getMyImages } from '../api/images';
import { theme } from '../core/theme';
import BackgroundPrivate from '../components/BackgroundPrivate';


export default function Album({ navigation }) {

    const [images, setImages] = useState([]);
    const [imagesReady, setImagesReady] = useState(false);

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const isTokenExp = await isTokenExpired();
                if (!isTokenExp) {
                    const myImages = await getMyImages();

                    if (myImages && myImages.length > 0) {
                        const encodedImagesPromises = myImages.map(async (generation) => {
                            const base64ImageUrl = await blobToBase64(
                                new Blob([new Uint8Array(generation.generatedImage.data.data)], {
                                    type: generation.generatedImage.type,
                                })
                            );
                            return { url: base64ImageUrl };
                        });

                        Promise.all(encodedImagesPromises)
                            .then((encodedImages) => {
                                setImages(encodedImages);
                                setImagesReady(true);
                            })
                            .catch((error) => {
                                console.error('Error converting images:', error);
                            });
                    }
                } else {
                    navigation.navigate('StartScreen');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        fetchUserInfo();
    }, []);

    return (
            <BackgroundPrivate>
                {imagesReady ? (
                    <PhotoGrid PhotosList={images} borderRadius={10} />
                ) : (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                )}
            </BackgroundPrivate>
    );

}