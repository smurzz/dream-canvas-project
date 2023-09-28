const router = require("express").Router();
const { isAuth } = require("../controllers/authController");
const { createUser, findUserByID } = require("../controllers/userController");
const { userValidator, validate } = require("../middlewares/userValidator");

router.post("/create", userValidator, validate, createUser);

router.get("/:userID", isAuth, findUserByID);

module.exports = router;
