const { check, validationResult } = require('express-validator');

exports.imageGenerationValidator = [
    check('subject')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Subject is required')
        .isString()
        .withMessage('Subject must be a string'),
    check('artDirection')
        .trim()
        .not()
        .isEmpty()        
        .withMessage('Art direction is required')
        .isString()
        .withMessage('Art direction must be a string'),
    check('artist')
        .optional({ nullable: true })
        .isString()
        .withMessage('Artist must be a string'),
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
    }
    next();
};
