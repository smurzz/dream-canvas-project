module.exports = {
    project: {
        ios: {},
        android: {}
    },
    assets: ['./src/assets/'],
    dependencies: {
        "@alentoma/react-native-selectable-text": {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided,
                ios: null // disable IOS platform, other platforms will still autolink if provided
            }
        }
    }
};