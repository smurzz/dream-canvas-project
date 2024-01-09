const ngrok = require("ngrok");
const nodemon = require("nodemon");
const config = require('./app/config/config');
require('dotenv').config();

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
        process.env.NGROK = url;
        console.log("ngrok url ------>", config.ngrokPublicUrl);

        nodemon({
            script: "./app.js",
            exec: `cross-env NGROK_URL=${url} node`,
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