const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
require('dotenv').config();

const database = require('./app/config/dbConfig');
// const txt2imagesRoutes = require('./app/routes/txt2imgRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const authRouters = require('./app/routes/authRoutes');
const userRouters = require('./app/routes/userRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
// app.use('/api/txt2image', txt2imagesRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRouters);
app.use('/api/users', userRouters);

const PORT = process.env.PORT; 

database.initDB(function (err, db) {
    if (db) {
        console.log("Database connection is successful.");
    } else {
        console.log("Database connection has failed.");
    }
});

// Error Handler
app.use(function (req, res, next) {
    res.status(404).json({ error: 'Sorry, looks like the page does not exist' });
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).json({ error: 'Oops! Something went wrong..' });
});

// Listening
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
