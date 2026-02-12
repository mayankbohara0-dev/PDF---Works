const multer = require('multer');
const path = require('path');
const os = require('os');

// Use system temp directory for Vercel (read-only filesystem elsewhere)
const uploadDir = os.tmpdir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-random-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log(`[Upload Debug] Checking file: ${file.originalname}, Mimetype: ${file.mimetype}`);
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        console.error(`[Upload Debug] Rejected file: ${file.originalname}, Mimetype: ${file.mimetype}`);
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

module.exports = upload;
