import React from 'react';
import { StyleSheet, View, FlatList, Image, SafeAreaView } from 'react-native'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import BackgroundPrivate from '../components/BackgroundPrivate';
import { theme } from '../core/theme';
import { Text, Divider } from 'react-native-paper';

export default function HelpPage({ navigation }) {
    const stylesList = [
        { key: 'Abstractionism' },
        { key: 'Classicism' },
        { key: 'Cubism' },
        { key: 'Expressionism' },
        { key: 'Impressionism' },
        { key: 'Minimalism' },
        { key: 'Pop-art' },
        { key: 'Realism' },
        { key: 'Renaissance' },
        { key: 'Surrealism' },
    ];
    
    return (
        <BackgroundPrivate>
            <View style={styles.title}>
                <Header>Instruction</Header>
            </View>
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleMedium" color={theme.colors.text}>1. Enter Your Idea:</Text>
                <Paragraph style={styles.text}>
                    Start by typing your creative idea for the artwork. For example,
                    <Text style={{ fontStyle: 'italic' }}>"A serene sunset over a tranquil lake."</Text>
                </Paragraph>
            </View>
            <Divider />
            <SafeAreaView style={{ marginVertical: 10 }}>
                <Text variant="titleMedium" color={theme.colors.text}>2. Select Artistic Style:</Text>
                <Paragraph style={styles.text}>
                    Choose an artistic direction from the options below. Your artwork will be created in this style:
                </Paragraph>
                <FlatList
                    style={styles.list}
                    data={stylesList}
                    renderItem={({ item }) => <Text style={styles.listItem}>   • {item.key}</Text>}
                />
            </SafeAreaView>
            <Divider />
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleMedium" color={theme.colors.text}>3. Explore Inspiring Artists:</Text>
                <Paragraph style={styles.text}>
                    Discover renowned artists who have excelled in your chosen style. Get inspired by their work!
                </Paragraph>
            </View>
            <Divider />
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleMedium" color={theme.colors.text}>4. Generate Your Art:</Text>
                <Paragraph style={styles.text}>
                    Hit the "Generate" button to create your unique artwork. It will appear below when ready.
                </Paragraph>
                <View style={styles.imageContainer}>
                    <Paragraph style={styles.text}>
                        <Text variant="titleSmall" color={theme.colors.text}>Example:</Text>{"\n"}
                        Idea: <Text style={styles.exampleText}>A serene sunset over a tranquil lake</Text>{"\n"}
                        Artistic style: <Text style={styles.exampleText}>impressionism</Text>{"\n"}
                        Artist: <Text style={styles.exampleText}>Edgar Degas</Text>
                    </Paragraph>
                    <Image
                        style={styles.image}
                        source={require('../../public/images/00000-964785682.png')}
                    />
                </View>
            </View>
            <Divider />
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleMedium" color={theme.colors.text}>5. Save Your Masterpiece:</Text>
                <Paragraph style={styles.text}>
                    Don't forget to save your creation to your phone's gallery.
                </Paragraph>
            </View>
        </BackgroundPrivate>
    );
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        textAlign: 'left',
    },
    list: {
        marginTop: 5,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 15,
        margin: 20
    },
    exampleText: {
        fontStyle: 'italic',
        color: theme.colors.text
    },
    listItem: {
        color: theme.colors.text,
    },
});