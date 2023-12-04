const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Model = sequelize.define('Model', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sdapiModelId: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('men', 'female', 'couple', 'null'),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('ready', 'in_process', 'failed'),
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    return Model;
};
