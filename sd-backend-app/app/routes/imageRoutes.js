const { isAuth } = require("../controllers/authController");
const { createImg2img, findAllMyImages, findImageById, createTxt2img } = require("../controllers/imageController");
const { imageGenerationValidator, validate } = require("../middlewares/imageGenerationValidator");
const multer = require("../middlewares/multer");

const router = require("express").Router();

// GET
router.get("/myImages", isAuth, findAllMyImages);

router.get("/:id", findImageById);

// POST
router.post("/img2img", multer.single("file"), createImg2img);

router.post("/txt2img", isAuth, imageGenerationValidator, validate, createTxt2img);

module.exports = router;
