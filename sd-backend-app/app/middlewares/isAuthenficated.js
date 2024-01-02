const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is not provided' });
    }

    const secret = process.env.TOKEN_KEY;
    try {
        const decodedToken = jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'User is unauthorized' });
        }

        req.user = decodedToken;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message || 'Could not decode the token' });
    }
};

module.exports = { isAuth };
