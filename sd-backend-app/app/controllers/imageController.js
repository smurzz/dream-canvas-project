const fs = require('fs');
const path = require('path');
const { db } = require('../config/dbConfig');
const axios = require('axios');
const config = require('../config/config');
require('dotenv').config();
const { getPrompt, negativePrompts } = require('../utils/imageUtils');
const { validateUser } = require('../utils/userUtils');

// FIND
const findAllMyImages = async (req, res) => {
    const userEmail = req.user.email;

    try {
        // Find the user and check if the user exists
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        const allImages = await db.ImageGeneration.findAll({
            where: { author_id: author.id },
            include: [
                {
                    model: db.Image,
                    as: 'generatedImage',
                }
            ],
        });

        // Convert blob data to base64
        const imagesWithBase64 = allImages.map(image => {
            const base64 = Buffer.from(image.generatedImage.data).toString('base64');
            return {
                ...image.toJSON(),
                generatedImage: { ...image.generatedImage.toJSON(), data: base64, },
            };
        });

        res.status(200).json(imagesWithBase64);
    } catch (error) {
        console.error('Error by getting user images: ', error);
        res.status(500).json({ error: 'Failed to get user images' });
    }
}
const findAllGeneratedImages = async (req, res) => {
    const userEmail = req.user.email;
    const query = req.query;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        if (author.isAdmin) {
            const allGeneratedImages = await db.ImageGeneration.findAll({ where: query });

            res.status(200).json(allGeneratedImages);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting all generated images:', error);
        res.status(500).json({ error: 'Failed to get all generated images' });
    }
};
const findGeneratedImageById = async (req, res) => {
    const userEmail = req.user.email;
    const generatedImageId = req.params.generationID;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        if (author.isAdmin) {
            const generatedImage = await db.ImageGeneration.findByPk(generatedImageId);

            if (!generatedImage) return res.status(404).json({ error: `Generated image with id ${generatedImageId} not found` });

            res.status(200).json(generatedImage);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting generated image by ID:', error);
        res.status(500).json({ error: 'Failed to get the generated image by ID' });
    }
};
const findAllImages = async (req, res) => {
    const userEmail = req.user.email;
    const query = req.query;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        if (author.isAdmin) {
            const allImages = await db.Image.findAll({ where: query });

            const imagesWithBase64 = allImages.map(image => {
                const base64 = Buffer.from(image.data).toString('base64');
                return {
                    ...image.toJSON(), data: base64,
                };
            });

            res.status(200).json(imagesWithBase64);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting all image by ID:', error);
        res.status(500).json({ error: 'Failed to get all image by ID' });
    }
};
const findImageById = async (req, res) => {
    /* const userEmail = req.user.email; */
    const imageId = req.params.imageID;

    try {
        const image = await db.Image.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.setHeader('Content-Type', image.type);
        res.setHeader('Content-Disposition', `inline; filename="${image.name}"`);
        res.status(200).send(image.data);
    } catch (error) {
        console.error('Error getting image by ID:', error);
        res.status(500).json({ error: 'Failed to get the image by ID' });
    }
};

// CREATE
const createImg2img = async (req, res) => {
    const { mimetype, originalname, filename } = req.file;
    const { subject, artDirection, artist } = req.body;
    const userEmail = req.user.email;

    const externalServiceUrl = 'http://127.0.0.1:7860/sdapi/v1/img2img';
    const prompt = `${artDirection}-style painting of ${subject}${artist ? `, by ${artist}` : ''}`;

    const t = await db.sequelize.transaction();

    try {
        // Find the user and check if the user exists
        const author = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!author) return res.status(404).json({ error: "User is not found" });

        // Store uploaded image locally and get Base64 data from it
        if (req.file === undefined) return res.status(400).json({ error: "You must select a file" });
        const filePath = path.join('app/resources/static/assets/uploads', filename);
        const fileData = await fs.promises.readFile(filePath);
        const base64String = fileData.toString('base64');

        // Generate an image with the stable diffusion API
        const sdResponse = await axios.post(externalServiceUrl, {
            prompt,
            init_images: [base64String],
            save_images: true
        });

        if (!sdResponse.data || !sdResponse.data.images) {
            return res.status(500).json({ error: 'Failed to create an image' });
        }

        // Create an image
        const base64ImageData = sdResponse.data.images[0];
        const imageDataBuffer = Buffer.from(base64ImageData, 'base64');

        const uploadImage = await db.Image.create({
            type: mimetype,
            name: originalname,
            data: fileData,
        }, { transaction: t });

        const generatedImage = await db.Image.create({
            type: "image/png",
            name: `dream-canvas-${Date.now()}`,
            data: imageDataBuffer,
        }, { transaction: t });

        // Create image generation information
        const newImageGeneration = await db.ImageGeneration.create({
            subject,
            artDirection,
            artist,
            author_id: author.id,
            generatedImage_id: generatedImage.id,
            uploadedImage_id: uploadImage.id
        }, { transaction: t });

        // Get generated data
        const generation = await db.ImageGeneration.findByPk(newImageGeneration.id, {
            include: [
                { model: db.Image, as: 'generatedImage', },
                { model: db.Image, as: 'uploadedImage', },
            ],
            transaction: t
        });

        // Convert blob data to base64
        const generatedImageBase64 = Buffer.from(generation.generatedImage.data).toString('base64');
        generation.generatedImage.data = generatedImageBase64;
        const uploadedImageBase64 = Buffer.from(generation.uploadedImage.data).toString('base64');
        generation.uploadedImage.data = uploadedImageBase64;

        await t.commit();
        res.status(201).json(generation);
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Failed to create an image' });
    }
}
const createTxt2img = async (req, res) => {
    const { subject, artDirection, artist } = req.body;
    const userEmail = req.user.email;

    const externalServiceUrl = 'http://127.0.0.1:7860/sdapi/v1/txt2img';
    const prompt = `${artDirection}-style painting of ${subject}${artist ? `, by ${artist}` : ''}`;

    const t = await db.sequelize.transaction();

    try {
        // Find the user and check if the user exists
        const author = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!author) return res.status(404).json({ error: "User is not found" });

        // Generate an image with the stable diffusion API
        const sdResponse = await axios.post(externalServiceUrl, { prompt, save_images: true });

        if (!sdResponse.data || !sdResponse.data.images) {
            return res.status(500).json({ error: 'Failed to create an image' });
        }

        // Create an image
        const base64ImageData = sdResponse.data.images[0];
        const imageDataBuffer = Buffer.from(base64ImageData, 'base64');

        const newImage = await db.Image.create({
            type: "image/png",
            name: `dream-canvas-${Date.now()}`,
            data: imageDataBuffer,
        }, { transaction: t });

        // Create image generation information
        const newImageGeneration = await db.ImageGeneration.create({
            subject,
            artDirection,
            artist,
            author_id: author.id,
            generatedImage_id: newImage.id
        }, { transaction: t });

        // Get generated data
        const generatedImage = await db.ImageGeneration.findByPk(newImageGeneration.id, {
            include: [{ model: db.Image, as: 'generatedImage', }],
            transaction: t
        });

        // Convert blob data to base64
        const base64 = Buffer.from(generatedImage.generatedImage.data).toString('base64');
        generatedImage.generatedImage.data = base64;

        await t.commit();
        res.status(201).json(generatedImage);
    } catch (error) {
        console.error('Error by image generation: ', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate an image' });
    }
}
const createImg2imgSDAPI = async (req, res) => {
    console.log(req.file);
    const { mimetype, originalname, filename } = req.file;
    const { subject, artDirection, artist, model_id } = req.body;
    const userEmail = req.user.email;
    const ngrokURL = process.env.NGROK;
    const sdapiKey = process.env.KEY_SDAPI;

    const externalServiceUrl = model_id ? process.env.DREAMBOOTH_IMG2IMG_URL : process.env.IMG2IMG_URL;
    const prompt = getPrompt(artDirection, subject, artist);
    const formattedStyle = artDirection === "pop-art" ? artDirection.replace('-', '').toLowerCase() : artDirection;

    const t = await db.sequelize.transaction();

    try {
        // Find the user and check if the user exists
        const author = await validateUser(userEmail, t);

        // Store uploaded image locally and get Base64 data from it
        if (req.file === undefined) return res.status(400).json({ error: "You must select a file" });
        const filePath = path.join('app/resources/static/assets/uploads', filename);
        const fileData = await fs.promises.readFile(filePath);

        // Generate an image with the stable diffusion API
        let sdResponse = await axios.post(externalServiceUrl, {
            key: sdapiKey,
            model_id,
            prompt,
            negative_prompt: negativePrompts[formattedStyle],
            init_image: `${ngrokURL}/${filename}`,
            width: 512,
            height: 512,
            samples: 1,
            num_inference_steps: 30,
            safety_checker: "no",
            enhance_prompt: "no",
            guidance_scale: 16,
            strength: 0.45,
            seed: null,
            webhook: null,
            track_id: null
        });

        // Delay request, if status "processing"
        if (sdResponse.data.status === "processing") {
            console.log("Image in processing: Delay 30 sec");
            const fetchURL = sdResponse.data.fetch_result;

            await delay(35000);
            const fetchQueuedResponse = await axios.post(fetchURL, { key: sdapiKey });

            if (fetchQueuedResponse.data.output && fetchQueuedResponse.data.status === 'success') {
                sdResponse = fetchQueuedResponse;
            } else {
                await t.rollback();
                return res.status(500).json({ error: 'Server is currently high demand. Please try again later.' });
            }
        }

        if (!sdResponse.data || !sdResponse.data.output) {
            console.log(sdResponse);
            return res.status(500).json({ error: 'Failed to get a generated image' });
        }

        // Create (uploaded and generated) images
        const generatedImageUrl = sdResponse.data.output[0];

        const uploadImage = await db.Image.create({
            type: mimetype,
            name: originalname,
            data: fileData,
        }, { transaction: t });

        const generatedImageData = await getImageDataFromImagePublicUrl(generatedImageUrl);

        const generatedImage = await db.Image.create({
            type: "image/png",
            name: generatedImageData.filenameGeneratedImage,
            data: generatedImageData.fileDataGeneratedImage,
        }, { transaction: t });

        // Create image generation information
        const newImageGeneration = await db.ImageGeneration.create({
            subject,
            artDirection,
            artist,
            author_id: author.id,
            generatedImage_id: generatedImage.id,
            uploadedImage_id: uploadImage.id
        }, { transaction: t });

        // Get generated data
        const generation = await db.ImageGeneration.findByPk(newImageGeneration.id, {
            include: [
                { model: db.Image, as: 'generatedImage', },
                { model: db.Image, as: 'uploadedImage', },
            ],
            transaction: t
        });

        // Convert blob data to base64
        const generatedImageBase64 = Buffer.from(generation.generatedImage.data).toString('base64');
        generation.generatedImage.data = generatedImageBase64;
        const uploadedImageBase64 = Buffer.from(generation.uploadedImage.data).toString('base64');
        generation.uploadedImage.data = uploadedImageBase64;

        await t.commit();
        res.status(201).json(generation);
    } catch (error) {
        const errMessage = error.response?.data?.message ?? error;
        console.error('Error creating by image to image:', errMessage);
        await t.rollback();

        if (error.message === 'User not found') {
            res.status(404).json({ error: "User is not found" });
        } else {
            res.status(500).json({ error: 'Failed to generate an image' });
        }
    }
}
const createTxt2imgSDAPI = async (req, res) => {
    const { subject, artDirection, artist, model_id } = req.body;
    const userEmail = req.user.email;
    const sdapiKey = process.env.KEY_SDAPI;
    console.log(req.body);

    const externalServiceUrl = model_id ? process.env.DREAMBOOTH_TXT2IMG_URL : process.env.TEXT2IMG_URL;
    const prompt = getPrompt(artDirection, subject, artist);
    const formattedStyle = artDirection === "pop-art" ? artDirection.replace('-', '').toLowerCase() : artDirection;

    const t = await db.sequelize.transaction();

    try {
        // Find the user and check if the user exists
        const author = await validateUser(userEmail, t);

        // Generate an image with the stable diffusion API
        let sdResponse = await axios.post(externalServiceUrl, {
            key: sdapiKey,
            model_id,
            prompt,
            negative_prompt: negativePrompts[formattedStyle],
            width: 512,
            height: 512,
            samples: 1,
            num_inference_steps: 30,
            safety_checker: "no",
            enhance_prompt: "no",
            seed: null,
            guidance_scale: 7.5,
            webhook: null,
            track_id: null
        });

        // Delay request, if status "processing"
        if (sdResponse.data.status === "processing") {
            console.log("Image in processing: Delay 30 sec");
            const fetchURL = sdResponse.data.fetch_result;

            await delay(35000);
            const fetchQueuedResponse = await axios.post(fetchURL, { key: sdapiKey });
            
            if (fetchQueuedResponse.data.output && fetchQueuedResponse.data.status === 'success') {
                console.log(fetchQueuedResponse);
                sdResponse = fetchQueuedResponse;
            } else {
                await t.rollback();
                return res.status(500).json({ error: 'Server is currently high demand. Please try again later.' });
            }
        }

        // no date (Error)
        if (!sdResponse.data || !sdResponse.data.output) {
            return res.status(500).json({ error: 'Failed to create an image' });
        }

        // Create an image
        const generatedImageUrl = sdResponse.data.output[0];
        const generatedImageData = await getImageDataFromImagePublicUrl(generatedImageUrl);

        const newImage = await db.Image.create({
            type: "image/png",
            name: generatedImageData.filenameGeneratedImage,
            data: generatedImageData.fileDataGeneratedImage,
        }, { transaction: t });

        // Create image generation information
        const newImageGeneration = await db.ImageGeneration.create({
            subject,
            artDirection,
            artist,
            author_id: author.id,
            generatedImage_id: newImage.id
        }, { transaction: t });

        // Get generated data
        const generatedImage = await db.ImageGeneration.findByPk(newImageGeneration.id, {
            include: [{ model: db.Image, as: 'generatedImage', }],
            transaction: t
        });

        // Convert blob data to base64
        const base64 = Buffer.from(generatedImage.generatedImage.data).toString('base64');
        generatedImage.generatedImage.data = base64;

        await t.commit();
        res.status(201).json(generatedImage);
    } catch (error) {
        const errMessage = error.response?.data?.message ?? error;
        // console.error('Error creating by text to image:', errMessage);
        console.log(errMessage);
        await t.rollback();

        if (error.message === 'User not found') {
            res.status(404).json({ error: "User is not found" });
        } else {
            res.status(500).json({ error: 'Failed to generate an text to image' });
        }
    }
}

// DELETE
const deleteImageById = async (req, res) => {
    const imageID = req.params.imageID;
    const userEmail = req.user.email;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin) {
            const foundImage = await db.Image.findByPk(imageID);
            if (!foundImage) return res.status(404).json({ error: `Image with id ${imageID} is not found` });

            await foundImage.destroy();
            res.status(204).end();
        } else {
            return res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete an image' });
    }
}
const deleteAllImages = async (req, res) => {
    const userEmail = req.user.email;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (!user.isAdmin) return res.status(403).json({ error: 'User is not authorized' });

        await db.Image.destroy({
            where: {},
            truncate: true
        });

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting all images: ', error);
        res.status(500).json({ error: 'Failed to delete all images' });
    }
};
const deleteGeneratedImageById = async (req, res) => {
    const generationID = req.params.generationID;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();
    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const foundGeneration = await db.ImageGeneration.findByPk(generationID, {
            include: [
                { model: db.Image, as: 'generatedImage' },
                { model: db.Image, as: 'uploadedImage' },
            ],
            transaction: t,
        });
        if (!foundGeneration) return res.status(404).json({ error: `Image Generation with id ${generationID} is not found` });

        if (user.isAdmin || user.id === foundGeneration.author_id) {
            if (foundGeneration.generatedImage) await foundGeneration.generatedImage.destroy({ transaction: t });
            if (foundGeneration.uploadedImage) await foundGeneration.uploadedImage.destroy({ transaction: t });

            await foundGeneration.destroy({ transaction: t });
            await t.commit();
            res.status(204).end();
        } else {
            return res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error deleting image generation:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to delete an image generation' });
    }
}
const deleteAllMyGeneratedImages = async (req, res) => {
    const userEmail = req.user.email;
    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const allImageGenerations = await db.ImageGeneration.findAll({
            where: { author_id: user.id },
            include: [
                { model: db.Image, as: 'generatedImage', },
                { model: db.Image, as: 'uploadedImage', },
            ],
            transaction: t,
        });

        for (const generation of allImageGenerations) {
            if (generation.generatedImage) await generation.generatedImage.destroy({ transaction: t });
            if (generation.uploadedImage) await generation.uploadedImage.destroy({ transaction: t });
            await generation.destroy({ transaction: t });
        }

        await t.commit();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting all image generations:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to delete all image generations' });
    }
}
const deleteAllGeneratedImages = async (req, res) => {
    const userEmail = req.user.email;
    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (!user.isAdmin) return res.status(403).json({ error: 'User is not authorized' });

        await db.Image.destroy({
            where: {},
            truncate: true,
            transaction: t,
        });

        await db.ImageGeneration.destroy({
            where: {},
            truncate: true,
            transaction: t,
        });

        await t.commit();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting all generated images: ', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to delete all generated images' });
    }
};

// delay
function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// get image data from URL
async function getImageDataFromImagePublicUrl(generatedImageUrl) {
    const responseGeneratedImage = await axios.get(generatedImageUrl, { responseType: 'stream' });

    const filenameGeneratedImage = `${Date.now()}-sd-api.png`;
    const writerGeneratedImage = fs.createWriteStream(`app/resources/static/assets/downloads/${filenameGeneratedImage}`);
    responseGeneratedImage.data.pipe(writerGeneratedImage);

    // Wait for the finish event
    await new Promise((resolve, reject) => {
        writerGeneratedImage.on('finish', resolve);
        writerGeneratedImage.on('error', reject);
    });

    const filePathGeneratedImage = path.join('app/resources/static/assets/downloads', filenameGeneratedImage);
    const fileDataGeneratedImage = await fs.promises.readFile(filePathGeneratedImage);

    return { filenameGeneratedImage, fileDataGeneratedImage };
}

module.exports = {
    findAllMyImages,
    findAllGeneratedImages,
    findAllImages,
    findGeneratedImageById,
    findImageById,
    createImg2img,
    createImg2imgSDAPI,
    createTxt2img,
    createTxt2imgSDAPI,
    deleteImageById,
    deleteAllImages,
    deleteGeneratedImageById,
    deleteAllMyGeneratedImages,
    deleteAllGeneratedImages
};