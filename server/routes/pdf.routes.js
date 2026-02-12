const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const {
    mergePdfs,
    splitPdf,
    compressPdf,
    repairPdf,
    pdfToImage,
    protectPdf,
    pdfToWord,
    pdfToExcel
} = require('../controllers/pdfController');

// Apply authentication middleware to all PDF routes
router.use(authMiddleware);

// Existing routes
// Merge PDF Route - Accepts up to 10 PDF files
router.post('/merge', upload.array('pdfs', 10), mergePdfs);

// Split PDF Route - Accepts a single PDF file with page range specification
router.post('/split', upload.array('pdf', 1), splitPdf);

// Compress PDF Route - Accepts a single PDF file for compression
router.post('/compress', upload.array('pdf', 1), compressPdf);

// New routes
// Repair PDF Route - Attempts to fix corrupted PDF files
router.post('/repair', upload.array('pdf', 1), repairPdf);

// PDF to Image Route - Converts PDF pages to images (JPG, PNG, WEBP)
router.post('/to-image', upload.array('pdf', 1), pdfToImage);

// Protect PDF Route - Adds password encryption to PDF
router.post('/protect', upload.array('pdf', 1), protectPdf);

// PDF to Word Route - Converts PDF to DOCX (placeholder for now)
router.post('/to-word', upload.array('pdf', 1), pdfToWord);

// PDF to Excel Route - Converts PDF to XLSX (placeholder for now)
router.post('/to-excel', upload.array('pdf', 1), pdfToExcel);

module.exports = router;
