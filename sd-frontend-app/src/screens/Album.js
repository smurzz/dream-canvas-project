import React, { useState, useEffect } from 'react';
import { ActivityIndicator, } from 'react-native';
import { PhotoGrid } from 'react-native-photo-grid-frame';
import { isTokenExpired } from '../utils/isAuth';
import { getMyImages } from '../api/images';
import { theme } from '../core/theme';
import BackgroundPrivate from '../components/BackgroundPrivate';
import Paragraph from '../components/Paragraph';

export default function Album({ navigation }) {

    const [images, setImages] = useState([]);
    const [imagesReady, setImagesReady] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const isTokenExp = await isTokenExpired();
                if (!isTokenExp) {
                    const myImages = await getMyImages();
                    if (myImages && myImages.length > 0) {
                        const encodedImagesPromises = myImages.map((generation) => {
                            const base64url = `data:${generation.generatedImage.type};base64,${generation.generatedImage.data}`;
                            return { url: base64url };
                        });
                        setImages(encodedImagesPromises);
                        setImagesReady(true);
                    } else {
                        setMessage("No Images.. Create your first artwork!")
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
            ) : message ? (
                <Paragraph>{message}</Paragraph>
            ) : (<ActivityIndicator size="small" color={theme.colors.primary} />)}
        </BackgroundPrivate>
    );

}