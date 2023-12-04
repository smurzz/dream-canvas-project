const uploadMultipleMiddleware = require("../middlewares/uploadMultipleMiddleware");
const router = require("express").Router();
const { isAuth } = require("../controllers/authController");
const { 
    findAllModels, 
    findModelById, 
    findMyModel, 
    createModel, 
    webhookStatusModel, 
    deleteModelById
} = require("../controllers/modelController");

// GET
router.get("/myModel", isAuth, findMyModel);

router.get("/", isAuth, findAllModels);

router.get("/:id", isAuth, findModelById);

// POST
router.post("/training-status/:id", webhookStatusModel);

router.post("/", isAuth, uploadMultipleMiddleware, createModel);

// DELETE
router.delete("/:id", isAuth, deleteModelById);

module.exports = router;