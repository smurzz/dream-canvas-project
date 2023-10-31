const { check, validationResult } = require('express-validator');

exports.userValidator = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid email format'),

    check('password')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters'),

    check('firstname')
        .optional({ nullable: true })
        .isString()
        .withMessage('Firstname must be a string'),

    check('lastname')
        .optional({ nullable: true })
        .isString()
        .withMessage('Lastname must be a string'),
];

exports.validateUser = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
    }
    next();
};
