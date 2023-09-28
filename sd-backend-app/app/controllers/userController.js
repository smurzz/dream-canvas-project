const bcrypt = require('bcryptjs');
const { db } = require('../config/dbConfig');

const createUser = async (req, res) => {
    const {email, password, firstname, lastname} = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });

        const result =  { 
            user_id: newUser.user_id, 
            email: newUser.email, 
            firstname: newUser.firstname, 
            lastname : newUser.lastname,
        };

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create a new user' });
    }
}

const findUserByID = async (req, res) => {
    var userID = req.params.userID;

    try {
        const foundUser = await db.User.findByPk(userID);

        if(foundUser){
            const result =  { 
                user_id: foundUser.user_id, 
                email: foundUser.email, 
                firstname: foundUser.firstname, 
                lastname : foundUser.lastname,
            };

            res.status(200).json(result);
        } else {

        }

    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get a user' });
    }
}

module.exports = { createUser, findUserByID };