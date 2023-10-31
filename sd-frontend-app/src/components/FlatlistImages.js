import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import ImageModal from './ImageModal';

export default function FlatlistImages({ data }) {
    const [visible, setIsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleModal = async (image) => {
        setIsVisible(() => !visible);
        setSelectedImage(image);
    }

    return (
        <SafeAreaView style={styles.container}>
            {visible && <ImageModal visible={visible} setIsVisible={setIsVisible} selectedImage={selectedImage} />}
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.listContainer}
                        key={item.id}
                        onPress={() => handleModal(item)}
                    >
                        <Image style={styles.imageThumbnail} source={{ uri: item.url }} />
                    </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 6,
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 150,
    },
});