const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig')

const Txt2image = sequelize.define('Txt2image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    prompt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Txt2image;