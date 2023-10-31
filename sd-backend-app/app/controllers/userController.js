const bcrypt = require('bcryptjs');
const { db } = require('../config/dbConfig');
const { emit } = require('nodemon');

// FIND
const findUsers = async (req, res) => {
    const userEmail = req.user.email;
    const query = req.query;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const isAuthorizedUser = (query && query.email) === user.email;

        if (user.isAdmin || isAuthorizedUser) {
            const foundUsers = await db.User.findAll({
                where: query,
                attributes: { exclude: ['password'] },
            });

            res.status(200).json(foundUsers);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get a user' });
    }
}
const findUserByID = async (req, res) => {
    const userID = req.params.userID;
    const userEmail = req.user.email;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin) {
            const foundUser = await db.User.findByPk(userID, {
                attributes: { exclude: ['password'] },
            });

            if (foundUser) {
                res.status(200).json(foundUser);
            } else {
                res.status(404).json({ error: `User with id ${userID} is not found` });
            }
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get a user' });
    }
}

// CREATE
const createUser = async (req, res) => {
    const { email, password, firstname, lastname, isAdmin } = req.body;
    const userEmail = req.user.email;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const userEmailToCreate = await db.User.findOne({ where: { email: email } });
        if (userEmailToCreate) return res.status(409).json({ error: "Email already in use" });

        if (user.isAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                isAdmin
            });

            const createdUser = await db.User.findByPk(newUser.id, {
                attributes: { exclude: ['password'] },
            });

            res.status(201).json(createdUser);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create a new user' });
    }
}

// UPDATE
const updateUserByID = async (req, res) => {
    const userID = req.params.userID;
    const { firstname, lastname, oldPassword, newPassword, confirmedPassword, isAdmin } = req.body;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();
    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const foundUser = await db.User.findByPk(userID);
        if (!foundUser) return res.status(404).json({ error: `User with id ${userID} is not found` });

        if (!(user.isAdmin || user.id === foundUser.id)) return res.status(403).json({ error: 'User is not authorized' });

        if (oldPassword) {
            const compareWithOldPass = await bcrypt.compare(oldPassword, foundUser.password);
            if (!compareWithOldPass) return res.status(400).json({ error: 'Old Password Incorrect' });

            if (newPassword !== confirmedPassword) return res.status(400).json({ error: 'New password and confirmation password must match' });

            if (!newPassword) return res.status(400).json({ error: 'New password must not be empty' });

            const compareWithNewPass = await bcrypt.compare(newPassword, foundUser.password);
            if (compareWithNewPass) return res.status(400).json({ error: 'New password must differ from the old one' });

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            foundUser.password = hashedNewPassword;
        }

        if (firstname !== foundUser.firstname) foundUser.firstname = firstname;
        if (lastname !== foundUser.lastname) foundUser.lastname = lastname;
        if (user.isAdmin && isAdmin !== undefined) foundUser.isAdmin = isAdmin;

        await foundUser.save({ transaction: t });
        await t.commit();
        res.status(200).json({ message: 'User is successfully updated' });
    } catch (error) {
        console.error('Error updating user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to update a user' });
    }
}

// DELETE
const deleteUserByID = async (req, res) => {
    const userID = req.params.userID;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const foundUser = await db.User.findByPk(userID);
        if (!foundUser) return res.status(404).json({ error: `User with id ${userID} is not found` });

        if (!(user.isAdmin || user.id === foundUser.id)) return res.status(403).json({ error: 'User is not authorized' });

        const allImageGenerations = await db.ImageGeneration.findAll({
            where: { author_id: foundUser.id },
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

        await foundUser.destroy({ transaction: t });
        await t.commit();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to delete a user' });
    }
}
const deleteAllUsers = async (req, res) => {
    const userEmail = req.user.email;

    try {
        const user = await db.User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (!user.isAdmin) return res.status(403).json({ error: 'User is not authorized' });

        await db.User.destroy({
            where: {},
            truncate: true
        });

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting all users: ', error);
        res.status(500).json({ error: 'Failed to delete all users' });
    }
};

module.exports = {
    findUsers,
    findUserByID,
    createUser,
    updateUserByID,
    deleteUserByID,
    deleteAllUsers
};