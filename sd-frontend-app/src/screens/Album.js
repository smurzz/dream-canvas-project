import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
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
    const [refreshing, setRefreshing] = useState(false);

    // Get all generated images
    const fetchUserImages = useCallback(async () => {
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
                            url: base64url,
                        };
                    });
                    setImages(encodedImagesPromises);
                    setImagesReady(true);
                } else {
                    setMessage('No Images.. Create your first artwork!');
                }
            } else {
                navigation.navigate('Start');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }, [navigation]);

    // reload data by screen visiting
    useEffect(() => {
        console.log("Refreshed");
        setImages([]);
        setImagesReady(false);
        fetchUserImages();
    }, [isFocused, fetchUserImages]);

    // reload data by refreshing
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchUserImages();
            setRefreshing(false);
        }, 2000);
    }, [fetchUserImages]);

    return (
        <BackgroundPrivate refreshing={refreshing} onRefresh={onRefresh}>
            {imagesReady ? (
                <FlatlistImages data={images} />
            ) : message ? (
                <Paragraph>{message}</Paragraph>
            ) : (<ActivityIndicator size="small" color={theme.colors.primary} />)}
        </BackgroundPrivate>
    );

}