const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "app/resources/static/assets/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-dream-canvas-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if(!file.mimetype.includes('image')){
        return cb("Invalid image format!", false);
    }
    cb(null, true);
};

module.exports = multer({ storage, fileFilter });