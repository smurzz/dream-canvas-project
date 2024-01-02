const { db } = require('../config/dbConfig');

const validateUser = async (email, transaction) => {
    const user = await db.User.findOne({ where: { email: email } }, { transaction: transaction });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

module.exports = { validateUser };