const router = require("express").Router();

const { userValidator, validateUser } = require("../middlewares/userValidator");
const { signup, login } = require('../controllers/authController');

// POST
router.post('/signup', userValidator, validateUser, signup);

router.post('/login', userValidator, validateUser, login);

module.exports = router;