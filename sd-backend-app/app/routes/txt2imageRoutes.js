var express = require('express');
var axios = require('axios');
var router = express.Router();

var txt2imageController = require('../controllers/txt2imageController');

router.post('/', async (req, res) => {
    console.log("Route: in txt2image");
    console.log(req);
    await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", req.body)
        .then((response) => {
            const imageURL = response.data.images;
            res.status(201).send(imageURL);
            console.log("The image is successully created by SD, the prompt is: " + req.body.prompt);
        })
        .catch(error => {
            console.log("Error: " + error);
            res.status(400).json( {"Error": error} );
        });
        /* const response = await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", req.body);
        const data = await response;
        const imageURL = data.images;
        res.status(201).send(imageURL);
        console.log("Request is send"); */
})

module.exports = router;