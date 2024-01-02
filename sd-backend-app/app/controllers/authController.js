const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/dbConfig');
require('dotenv').config();

const signup = async (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;

    try {
        const existingUser = await db.User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.User.create({
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });

        res.status(200).json({ message: "User was successfully created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create a new user" });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await db.User.findOne({ where: { email: email } });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const compareRes = await bcrypt.compare(password, existingUser.password);

        if (compareRes) {
            const secret = process.env.TOKEN_KEY;
            const token = jwt.sign({ email: email }, secret, { expiresIn: '1h', algorithm: 'HS256' });
            res.status(200).json({ "token": token });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Failed to login a user" });
    }
};

module.exports = { signup, login };
