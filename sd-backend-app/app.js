const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const database = require('./app/config/dbConfig');
const modelRoutes = require('./app/routes/modelRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const authRouters = require('./app/routes/authRoutes');
const userRouters = require('./app/routes/userRoutes');

const imagesDirectoryUploads = path.join(__dirname, 'app/resources/static/assets/uploads');
const imagesDirectoryDownloads = path.join(__dirname, 'app/resources/static/assets/downloads');
const imagesDirectoryUploadsModel = path.join(__dirname, 'app/resources/static/assets/uploads/model');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/', express.static(imagesDirectoryUploads));
app.use('/', express.static(imagesDirectoryDownloads));
app.use('/', express.static(imagesDirectoryUploadsModel));
app.use('/api/models', modelRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRouters);
app.use('/api/users', userRouters);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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

