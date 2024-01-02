import React from 'react'
import { ImageBackground, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { theme } from '../core/theme'

export default function BackgroundPrivate({ children, refreshing, onRefresh }) {

    return (
        <ImageBackground
            source={require('../assets/white.jpg')}
            resizeMode="repeat"
            style={styles.background}
        >
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
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
        padding: 20,
    },
})
