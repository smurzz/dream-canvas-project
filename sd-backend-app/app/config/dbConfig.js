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

    await sequelize.sync();
}

module.exports = {
    initDB,
    db,
}