import React from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Paragraph from './Paragraph';
import { theme } from '../core/theme';
import Header from './Header';

export default function ImageModal({ visible, setIsVisible, selectedImage }) {

    return (
        <Modal visible={visible} transparent={true} style={styles.modalContainer}>
            <TouchableOpacity
                onPress={() => setIsVisible(() => !visible)}
                style={styles.modalBackground}>
                    <Header style={{ color: theme.colors.secondary }}>{selectedImage.style}</Header>
                    <Image style={styles.modalImage} source={{ uri: selectedImage.url }} />
                    <Paragraph style={{ color: theme.colors.secondary }}>{selectedImage.idea}</Paragraph>
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
});