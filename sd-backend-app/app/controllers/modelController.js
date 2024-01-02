const fs = require('fs');
const path = require('path');
const { db } = require('../config/dbConfig');
const { default: axios } = require('axios');
const config = require('../config/config');
var randomstring = require('randomstring');
const { validateUser } = require('../utils/userUtils');
require('dotenv').config();

// FIND
const findAllModels = async (req, res) => {
    const userEmail = req.user.email;
    const query = req.query;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        if (author.isAdmin) {
            const allModels = await db.Model.findAll({ where: query });

            res.status(200).json(allModels);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting models:', error);
        res.status(500).json({ error: 'Failed to get all models' });
    }
};
const findModelById = async (req, res) => {
    const userEmail = req.user.email;
    const modelID = req.params.id;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        if (author.isAdmin) {
            const model = await db.Model.findByPk(modelID);

            if (!model) return res.status(404).json({ error: `Model with id ${modelID} not found` });

            res.status(200).json(model);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting generated model by ID:', error);
        res.status(500).json({ error: 'Failed to get model by ID' });
    }
};
const findMyModel = async (req, res) => {
    const userEmail = req.user.email;

    try {
        const author = await db.User.findOne({ where: { email: userEmail } });
        if (!author) return res.status(404).json({ error: "User is not found" });

        const myModel = await db.Model.findOne({ where: { author_id: author.id } });

        if (!myModel) return res.status(404).json({ error: `Model not found` });

        res.status(200).json(myModel);
    } catch (error) {
        console.error('Error getting my model:', error);
        res.status(500).json({ error: 'Failed to get my model' });
    }
};

// CREATE
const webhookStatusModel = async (req, res) => {
    const { status, training_status, logs, model_id } = req.body;
    const modelID = req.params.id;

    const t = await db.sequelize.transaction();
    try {
        if (status === "success" && training_status === "model_ready") {
            const model = await db.Model.findByPk(modelID, { transaction: t });
            if (!model) return res.status(404).json({ error: `Model with id ${modelID} not found` });

            model.sdapiModelId = model_id;
            model.status = 'ready';

            await model.save({ transaction: t });

            const response = {
                message: 'Model is successfully created',
                model_id
            };

            res.status(200).json(response);
        } else {
            console.log(training_status);
            const response = {
                message: 'Model is not yet ready',
                training_status,
                status
            };
            res.status(200).json(response);
        }
        await t.commit();
    } catch (error) {
        console.error('Error handling webhook:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to handle webhook' });
    }
}
const createModel = async (req, res) => {
    const files = req.files;
    const { category, type } = req.body;
    const userEmail = req.user.email;

    const ngrok = config.ngrokPublicUrl || process.env.NGROK;
    const sdapiKey = process.env.KEY_SDAPI;
    const externalServiceUrl = process.env.DREAMBOOTH_URL;

    const t = await db.sequelize.transaction();

    try {
        // Find the user and check if the user exists
        const author = await validateUser(userEmail, t);

        const myModel = await db.Model.findOne({ where: { author_id: author.id } });

        if (myModel) return res.status(400).json({ error: `Model exists already` });

        // Generate random name for the instance
        const name = randomstring.generate({
            length: 5,
            charset: 'alphabetic'
        });
        const instance_prompt = `photo of ${name} ${category}`;
        const class_prompt = `photo of ${category}`;
        const images = files.map(file => `${ngrok}/${file.filename}`);
        const steps = images.length * 200;
        const typeModel = type === "other" ? 'null' : type;

        // Create model
        const newModel = await db.Model.create({
            name,
            category,
            type: typeModel,
            status: 'in_process',
            author_id: author.id,
        }, { transaction: t });

        await newModel.save({ transaction: t });

        // Create uploaded Images and add them to model 
        files.forEach(async file => {
            const filePath = path.join('app/resources/static/assets/uploads/model', file.filename);
            const fileData = await fs.promises.readFile(filePath);

            await db.Image.create({
                type: file.mimetype,
                name: file.originalname,
                data: fileData,
                model_id: newModel.id
            }, { transaction: t });
        });

        // Generate a model with the stable diffusion API
        const webhook = `${ngrok}/api/models/training-status/${newModel.id}`;

        let sdResponse = await axios.post(externalServiceUrl, {
            key: sdapiKey,
            instance_prompt,
            class_prompt,
            base_model_id: "midjourney",
            images,
            seed: "0",
            training_type: typeModel,
            max_train_steps: steps.toString(),
            webhook,
        });
        console.log(sdResponse);

        if (!(sdResponse.status === 200 && sdResponse.data.status === "success")) {
            console.log(sdResponse.error);
            await t.rollback();
            return res.status(500).json({ error: 'Failed to create a model in Stable Diffusion Api' });
        }

        await t.commit();
        res.status(201).json(newModel);
    } catch (error) {
        const errMessage = error.response?.data?.message ?? error;
        console.error('Error creating image:', errMessage);
        await t.rollback();

        if (error.message === 'User not found') {
            res.status(404).json({ error: "User is not found" });
        } else {
            res.status(500).json({ error: 'Failed to create a model' });
        }
    }
}

// DELETE
const deleteModelById = async (req, res) => {
    const modelId = req.params.id;
    const userEmail = req.user.email;

    const sdapiKey = process.env.KEY_SDAPI;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const foundModel = await db.Model.findByPk(modelId, {
            include: [
                { model: db.Image, as: 'uploadedImages', },
            ],
            transaction: t,
        });
        if (!foundModel) return res.status(404).json({ error: `Image with id ${modelId} is not found` });

        const externalServiceUrl = `https://stablediffusionapi.com/api/v3/finetune/delete/${foundModel.sdapiModelId}`;

        let sdResponse = await axios.post(externalServiceUrl, { key: sdapiKey });

        if (sdResponse.status !== 200) {
            console.log(sdResponse.error);
            await t.rollback();
            return res.status(500).json({ error: 'Failed to delete a model in Stable Diffusion Api' });
        }

        for (const uploadedImage of foundModel.uploadedImages) {
            await uploadedImage.destroy({ transaction: t });
        }

        await foundModel.destroy({ transaction: t });
        await t.commit();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting model:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to delete an model' });
    }
}

module.exports = {
    findAllModels,
    findModelById,
    findMyModel,
    webhookStatusModel,
    createModel,
    deleteModelById
};