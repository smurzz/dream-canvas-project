const { DataTypes } = require('sequelize');
const { db } = require('../config/dbConfig');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
        },
        firstname: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    return User;
};
