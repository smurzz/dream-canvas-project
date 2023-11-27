/* mysql.server start
mysql.server stop 
mysql -u root -p */

const mysql = require("mysql2");
const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = {};

async function initDB() {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        /* database: process.env.MYSQL_DB */
    });

    try {
        const databaseName = process.env.MYSQL_DB;
        const promiseConnection = connection.promise();
        await promiseConnection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);

        const sequelize = new Sequelize({
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        db.User = require('../models/userModel')(sequelize);
        db.Image = require('../models/imageModel')(sequelize);
        db.ImageGeneration = require('../models/imageGenerationModel')(sequelize);
        db.Model = require('../models/modelModel')(sequelize);

        // Define associations
        db.User.hasMany(db.ImageGeneration, { foreignKey: 'author_id', as: 'imageGenerations' });
        db.ImageGeneration.belongsTo(db.User, { foreignKey: 'author_id', as: 'author' });
        db.ImageGeneration.belongsTo(db.Image, { foreignKey: 'generatedImage_id', as: 'generatedImage' });
        db.ImageGeneration.belongsTo(db.Image, { foreignKey: 'uploadedImage_id', as: 'uploadedImage' });
        db.Model.belongsTo(db.User, { foreignKey: 'author_id', as: 'author' });
        db.Model.hasMany(db.Image, { foreignKey: 'uploadedImage_id', as: 'uploadedImage' });

        await sequelize.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database synchronization error: ', error);
    }
}

module.exports = {
    initDB,
    db,
}