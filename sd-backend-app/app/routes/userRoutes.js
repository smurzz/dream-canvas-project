const router = require("express").Router();
const { isAuth } = require("../middlewares/isAuthenficated");
const { createUser, findUserByID, updateUserByID, findUsers, deleteUserByID } = require("../controllers/userController");
const { updateUserValidator, validateUpdatedUser } = require("../middlewares/updateUserValidator");
const { userValidator, validateUser } = require("../middlewares/userValidator");

// GET
router.get("/", isAuth, findUsers);
router.get("/:userID", isAuth, findUserByID);

// POST
router.post("/", isAuth, userValidator, validateUser, createUser);

// UPDATE
router.put("/:userID", isAuth, updateUserValidator, validateUpdatedUser, updateUserByID);

// DELETE
router.delete("/:userID", isAuth, deleteUserByID);

module.exports = router;
