const multer = require("multer");
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "app/resources/static/assets/uploads/model");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-dream-canvas-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
    upload.array('files', 10)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const files = req.files;
        const errors = [];

        files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png'];

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }
        });

        const convertAndSave = async (file) => {
            const outputPath = file.path.substring(0, file.path.lastIndexOf('.'));
            const outputFilename = file.filename.substring(0, file.filename.lastIndexOf('.'))

            try {
                await sharp(file.path)
                    .resize(512, 512)
                    .rotate()
                    .toFormat('png')
                    .toFile(`${outputPath}.png`);

                fs.unlinkSync(file.path);

                return {
                    mimetype: 'image/png',
                    originalname: file.originalname,
                    filename: `${outputFilename}.png`,
                    path: outputPath
                };
            } catch (conversionError) {
                errors.push(`Error converting file: ${file.originalname}`);
                return null;
            }
        };

        const convertedFiles = await Promise.all(files.map(convertAndSave));

        if (errors.length > 0) {
            files.forEach((file) => {
                fs.unlinkSync(file.path);
            });

            return res.status(400).json({ errors });
        }

        req.files = convertedFiles.map((file) => ({
            mimetype: 'image/png',
            originalname: file.originalname,
            filename: file.filename,
        }));

        next();
    });
};

module.exports = uploadMiddleware;