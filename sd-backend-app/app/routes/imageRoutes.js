const uploadSingleMiddleware = require("../middlewares/uploadSingleMiddleware.js");
const router = require("express").Router();
const { imageGenerationValidator, validate } = require("../middlewares/imageGenerationValidator");
const { isAuth } = require("../controllers/authController");
const { 
    findAllMyImages, 
    findAllGeneratedImages, 
    findAllImages,
    findGeneratedImageById, 
    findImageById, 
    createTxt2img, 
    createImg2img,
    deleteImageById,
    deleteGeneratedImageById,
    deleteAllMyGeneratedImages,
    deleteAllImages,
    deleteAllGeneratedImages,
    createImg2imgSDAPI,
    createTxt2imgSDAPI,
} = require("../controllers/imageController");

// GET
router.get("/generations/myGenerations", isAuth, findAllMyImages);

router.get("/generations", isAuth, findAllGeneratedImages);

router.get("/generations/:generationID", isAuth, findGeneratedImageById);

router.get("/", isAuth, findAllImages);

router.get("/:imageID", isAuth, findImageById);

// POST
router.post("/img2img", isAuth, uploadSingleMiddleware.single("file"), imageGenerationValidator, validate, createImg2img);

router.post("/sd-api/img2img", isAuth, uploadSingleMiddleware.single("file"), imageGenerationValidator, validate, createImg2imgSDAPI);

router.post("/txt2img", isAuth, imageGenerationValidator, validate, createTxt2img);

router.post("/sd-api/txt2img", isAuth, imageGenerationValidator, validate, createTxt2imgSDAPI);

// DELETE
router.delete("/:imageID", isAuth, deleteImageById);

router.delete("/", isAuth, deleteAllImages);

router.delete("/generations/myGenerations", isAuth, deleteAllMyGeneratedImages);

router.delete("/generations/:generationID", isAuth, deleteGeneratedImageById);

router.delete("/generations", isAuth, deleteAllGeneratedImages);

module.exports = router;
