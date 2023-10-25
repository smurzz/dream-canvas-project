import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { theme } from '../core/theme';

export default function ImageRadioButton({ artist, onPress, selected, loading }) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.radioButton, { borderColor: selected ? theme.colors.primary : '#00000001' }]}
            disabled={loading} >
            <Image source={ artist.url } style={styles.image} />
            <View style={styles.caption}>
                <Text style={styles.captionText}>{artist.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioButton: {
        borderWidth: 2,
        borderRadius: 5,
        padding: 5,
        margin: 5,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 5,
    },
    caption: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: theme.colors.secondary,
        opacity: 0.8,
        marginLeft: 5,
        marginBottom: 5,
        padding: 2,
    },
    captionText: {
        color: theme.colors.text,
    }
})

