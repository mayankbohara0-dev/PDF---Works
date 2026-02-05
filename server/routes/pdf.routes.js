const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { mergePdfs } = require('../controllers/pdfController');

// All PDF routes protected
router.use(authMiddleware);

// Merge Route
router.post('/merge', upload.array('pdfs', 10), mergePdfs);

// Split Route
const { splitPdf, compressPdf } = require('../controllers/pdfController'); // Ensure this is imported effectively or destructured above
router.post('/split', upload.array('pdf', 1), splitPdf);

// Compress Route
router.post('/compress', upload.array('pdf', 1), compressPdf);

module.exports = router;
