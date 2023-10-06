var express = require('express');
var axios = require('axios');
const { createImage } = require('../controllers/imageController');
var router = express.Router();


router.post('/', async (req, res) => {
    console.log("Route: in txt2image");
    console.log(req);
    await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", req.body)
        .then((response) => {
            console.log(response.data);
            const imageURL = response.data.images;
            res.status(201).send(imageURL);
            console.log("The image is successully created, the prompt is: " + req.body.prompt);
        })
        .catch(error => {
            console.log("Error: " + error);
            res.status(400).json( {"Error": error} );
        });
})

module.exports = router;