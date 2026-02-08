const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { mergePdfs, splitPdf, compressPdf } = require('../controllers/pdfController');

// Apply authentication middleware to all PDF routes
router.use(authMiddleware);

// Merge PDF Route - Accepts up to 10 PDF files
router.post('/merge', upload.array('pdfs', 10), mergePdfs);

// Split PDF Route - Accepts a single PDF file with page range specification
router.post('/split', upload.array('pdf', 1), splitPdf);

// Compress PDF Route - Accepts a single PDF file for compression
router.post('/compress', upload.array('pdf', 1), compressPdf);

module.exports = router;
