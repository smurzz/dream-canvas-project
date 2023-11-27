if (process.env.NODE_ENV === "production") {
    console.error(
        "Do not use nodemon in production, run bin/www directly instead."
    );
    process.exitCode = 1;
    return;
}

const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');
const ngrok = require("ngrok");
const nodemon = require("nodemon");
const config = require('./app/config/config');

const database = require('./app/config/dbConfig');
// const txt2imagesRoutes = require('./app/routes/txt2imgRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const authRouters = require('./app/routes/authRoutes');
const userRouters = require('./app/routes/userRoutes');

const imagesDirectoryUploads = path.join(__dirname, 'app/resources/static/assets/uploads');
const imagesDirectoryDownloads = path.join(__dirname, 'app/resources/static/assets/downloads');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/', express.static(imagesDirectoryUploads));
app.use('/', express.static(imagesDirectoryDownloads));
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRouters);
app.use('/api/users', userRouters);

const PORT = process.env.PORT;

ngrok
    .connect({
        proto: "http",
        addr: PORT,
    })
    .then(url => {
        console.log(`ngrok tunnel opened at: ${url}`);
        console.log("Open the ngrok dashboard at: https://localhost:4040\n");

        config.ngrokPublicUrl = url;

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

        nodemon({
            script: "./bin/www",
            exec: `NGROK_URL=${url} node`,
        }).on("start", () => {
            console.log("The application has started");
        }).on("restart", files => {
            console.group("Application restarted due to:")
            files.forEach(file => console.log(file));
            console.groupEnd();
        }).on("quit", () => {
            console.log("The application has quit, closing ngrok tunnel");
            ngrok.kill().then(() => process.exit(0));
        });
    })
    .catch((error) => {
        console.error("Error opening ngrok tunnel: ", error);
        process.exitCode = 1;
    });