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
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    return Model;
};
