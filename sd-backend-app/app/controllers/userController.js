const bcrypt = require('bcryptjs');
const { db } = require('../config/dbConfig');

// FIND
const findAllUsers = async (req, res) => {
    const userEmail = req.user.email;
    const query = req.query;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin) {
            const foundUsers = await db.User.findAll({ where: query },{
                attributes: { exclude: ['password'] },
                transaction: t
            });

            await t.commit();
            res.status(200).json(foundUsers);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to get a user' });
    }
}
const findUserByID = async (req, res) => {
    const userID = req.params.userID;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin) {
            const foundUser = await db.User.findByPk(userID, {
                attributes: { exclude: ['password'] },
                transaction: t
            });

            if (foundUser) {
                await t.commit();
                res.status(200).json(foundUser);
            } else {
                res.status(404).json({ error: `User with id ${userID} is not found` });
            }
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to get a user' });
    }
}
const findUserByEmail = async (req, res) => {
    const email = req.query.email;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin || user.email === email) {
            const foundUser = await db.User.findByPk({ where: { email: email } }, {
                attributes: { exclude: ['password'] },
                transaction: t
            });

            if (foundUser) {
                await t.commit();
                res.status(200).json(foundUser);
            } else {
                res.status(404).json({ error: `User with email ${email} is not found` });
            }
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to get a user' });
    }
}

// CREATE
const createUser = async (req, res) => {
    const { email, password, firstname, lastname, isAdmin } = req.body;
    const userEmail = req.user.email;

    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!user) return res.status(404).json({ error: "User is not found" });

        if (user.isAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                isAdmin
            }, { transaction: t });

            const result = {
                user_id: newUser.user_id,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                isAdmin: newUser.isAdmin
            };

            await t.commit();
            res.status(201).json(result);
        } else {
            res.status(403).json({ error: 'User is not authorized' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        await t.rollback();
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
        const user = await db.User.findOne({ where: { email: userEmail } }, { transaction: t });
        if (!user) return res.status(404).json({ error: "User is not found" });

        const foundUser = await db.User.findByPk(userID, { transaction: t });

        if (foundUser) {
            if (firstname) foundUser.firstname = firstname;
            if (lastname) foundUser.lastname = lastname;
            if (user.isAdmin && isAdmin !== undefined) foundUser.isAdmin = isAdmin;

            if (user.id === foundUser.id && oldPassword) {
                const compareWithOldPass = await bcrypt.compare(oldPassword, foundUser.password);
                if (compareWithOldPass) {
                    const compareWithNewPass = await bcrypt.compare(newPassword, foundUser.password);
                    if (!compareWithNewPass) {
                        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                        foundUser.password = hashedNewPassword;
                    }
                } else {
                    await t.rollback();
                    res.status(400).json({ error: 'Old Password Incorrect' });
                    return;
                }
            }

            await foundUser.save({ transaction: t });
            await t.commit();
            res.status(200).json({ message: 'User is successfully updated' });
        } else {
            await t.rollback();
            res.status(404).json({ error: `User with id ${userID} is not found` });
            return;
        }
    } catch (error) {
        console.error('Error updating user:', error);
        await t.rollback();
        res.status(500).json({ error: 'Failed to update a user' });
    }
}
module.exports = { findAllUsers, findUserByID, findUserByEmail, createUser, updateUserByID };