const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ImageGeneration = sequelize.define('ImageGeneration', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        subject: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        artDirection: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
    });

    return ImageGeneration;
};