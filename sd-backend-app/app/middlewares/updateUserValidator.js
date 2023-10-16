const { check, validationResult } = require('express-validator');

exports.updateUserValidator = [
    check('firstname')
        .optional({ nullable: true })
        .isString()
        .withMessage('Firstname must be a string'),

    check('lastname')
        .optional({ nullable: true })
        .isString()
        .withMessage('Lastname must be a string'),

    check('oldPassword')
        .optional({ checkFalsy: true, nullable: true })
        /* .trim() */
        .isLength({ min: 3 })
        .withMessage('Old password must be at least 3 characters')
        .custom(async (oldPassword, { req }) => {
            if (oldPassword) {
                const newPassword = req.body.newPassword;
                const confirmedPassword = req.body.confirmedPassword;

                if (!newPassword || newPassword.length < 3) {
                    throw new Error('New password must be at least 3 characters');
                }

                if (!confirmedPassword || confirmedPassword.length < 3) {
                    throw new Error('Confirmed password must be at least 3 characters');
                }

                if (newPassword !== confirmedPassword) {
                    throw new Error('Confirmed password must match the new password.');
                }
            }
            return true;
        }),
    check('isAdmin')
        .optional({ nullable: true })
        .isBoolean()
        .withMessage('isAdmin must be a boolean'),
];

exports.validateUpdatedUser = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
    }
    next();
};
