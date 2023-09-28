const router = require("express").Router();

const { userValidator, validate } = require("../middlewares/userValidator");
const { signup, login } = require('../controllers/authController');

router.post('/signup', userValidator, validate, signup);

router.post('/login', userValidator, validate, login);

module.exports = router;