import React from 'react'
import { ImageBackground, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'

export default function BackgroundPrivate({ children }) {
    return (
        <ImageBackground
            source={require('../assets/background_dot.png')}
            resizeMode="repeat"
            style={styles.background}
        >
            <ScrollView style={styles.container}>
                {children}
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.surface,
    },
    container: {
        flexGrow: 1,
        width: '100%',
        paddingBottom: 20,
        padding: 20,
    },
})
