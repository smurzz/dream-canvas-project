const router = require("express").Router();
const { isAuth } = require("../controllers/authController");
const { createUser, findUserByID, updateUserByID, findAllUsers, findUserByEmail } = require("../controllers/userController");
const { updateUserValidator, validateUpdatedUser } = require("../middlewares/updateUserValidator");
const { userValidator, validate } = require("../middlewares/userValidator");

// GET
router.get("/:userID", isAuth, findUserByID);
/* router.get("/", isAuth, findUserByEmail); */
router.get("/", isAuth, findAllUsers);

// POST
router.post("/", isAuth, userValidator, validate, createUser);

// UPDATE
router.put("/:userID", isAuth, updateUserValidator, validateUpdatedUser, updateUserByID);

module.exports = router;
