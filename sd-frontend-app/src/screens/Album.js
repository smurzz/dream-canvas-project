import React, { useState, useEffect } from 'react';
import { ActivityIndicator, } from 'react-native';
import { isTokenExpired } from '../utils/isAuth';
import { getMyImages } from '../api/images';
import { theme } from '../core/theme';
import BackgroundPrivate from '../components/BackgroundPrivate';
import Paragraph from '../components/Paragraph';
import FlatlistImages from '../components/FlatlistImages';
import { useIsFocused } from '@react-navigation/native';

export default function Album({ navigation }) {
    const isFocused = useIsFocused();

    const [images, setImages] = useState([]);
    const [imagesReady, setImagesReady] = useState(false);
    const [message, setMessage] = useState('');

    // Get all generated images
    useEffect(() => {
        async function fetchUserImages() {
            try {
                const isTokenExp = await isTokenExpired();
                if (!isTokenExp) {
                    const myImages = await getMyImages();
                    if (myImages && myImages.length > 0) {
                        const encodedImagesPromises = myImages.map((generation) => {
                            const base64url = `data:${generation.generatedImage.type};base64,${generation.generatedImage.data}`;
                            const generationId = generation.id;
                            const generationIdea = generation.subject;
                            const generationStyle = generation.artDirection;
                            return {
                                id: generationId,
                                idea: generationIdea,
                                style: generationStyle,
                                url: base64url
                            };
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

        fetchUserImages();
    }, [isFocused]);

    return (
        <BackgroundPrivate>
            {imagesReady ? (
                <FlatlistImages data={images} />
            ) : message ? (
                <Paragraph>{message}</Paragraph>
            ) : (<ActivityIndicator size="small" color={theme.colors.primary} />)}
        </BackgroundPrivate>
    );

}