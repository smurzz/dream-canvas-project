const fs = require('fs');
const path = require('path');
const { db } = require('../config/dbConfig');
const { default: axios } = require('axios');
const { where } = require('sequelize');

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
                },
                {
                    model: db.User,
                    as: 'author',
                    attributes: { exclude: ['password'] },
                },
            ],
        });

        res.status(200).json(allImages);
    } catch (error) {
        console.error('Error by getting user images: ', error);
        res.status(500).json({ error: 'Failed to get user images' });
    }
}

const findImageById = async (req, res) => {
    try {
        const imageId = req.params.id;

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

    try {
        console.log(req.file);

        if (req.file === undefined) {
            return res.status(400).json({ error: "You must select a file" });
        }

        const { mimetype, originalname, filename } = req.file;

        const filePath = path.join('app/resources/static/assets/uploads', filename);
        const fileData = await fs.promises.readFile(filePath);

        await db.Image.create({
            type: mimetype,
            name: originalname,
            data: fileData,
        });

        res.status(201).json({ message: 'The image was successfully created' });
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
            include: [
                { model: db.Image, as: 'generatedImage', },
                { model: db.User, as: 'author', attributes: { exclude: ['password'] }, },
            ],
            transaction: t
        });

        await t.commit();
        res.status(201).json(generatedImage);
    } catch (error) {
        console.error('Error by image generation: ', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate an image' });
    }
}

module.exports = { createImg2img, createTxt2img, findAllMyImages, findImageById };