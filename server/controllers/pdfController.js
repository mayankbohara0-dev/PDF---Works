const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { isValidPdf } = require('../utils/validation');

// Constants
const MIN_FILES_FOR_MERGE = 2;

/**
 * Merge multiple PDF files into a single PDF document.
 * 
 * @param {Object} req - Express request object with files array
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads the merged PDF file
 */
const mergePdfs = async (req, res) => {
    try {
        if (!req.files || req.files.length < MIN_FILES_FOR_MERGE) {
            return res.status(400).json({ message: `At least ${MIN_FILES_FOR_MERGE} files are required.` });
        }

        // Validate all files first
        for (const file of req.files) {
            if (!isValidPdf(file.path)) {
                fs.unlink(file.path, () => { });
                return res.status(400).json({ message: `File ${file.originalname} is not a valid PDF.` });
            }
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const fileBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(fileBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const fileName = `merged-${Date.now()}.pdf`;
        const outputPath = path.join(os.tmpdir(), fileName);

        fs.writeFileSync(outputPath, mergedPdfBytes);

        res.download(outputPath, fileName, (err) => {
            if (err) {
                console.error('File download error:', err);
            }
            // Clean up input files for privacy
            req.files.forEach(f => {
                fs.unlink(f.path, () => { });
            });
        });

    } catch (error) {
        console.error('Merge Error:', error);
        res.status(500).json({ message: 'Error merging PDFs' });
    }
};

/**
 * Split a PDF file by extracting specified page ranges.
 * Accepts page ranges in format: "1-3, 5, 7-9" and creates a single PDF with those pages.
 * 
 * @param {Object} req - Express request object with file and body.ranges
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads the split PDF file
 */
const splitPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'A PDF file is required.' });
        }

        const file = req.files[0];

        if (!isValidPdf(file.path)) {
            fs.unlink(file.path, () => { });
            return res.status(400).json({ message: 'Invalid PDF file.' });
        }

        const ranges = req.body.ranges;

        if (!ranges) {
            return res.status(400).json({ message: 'Page ranges are required.' });
        }

        const fileBytes = fs.readFileSync(file.path);
        const originalPdf = await PDFDocument.load(fileBytes);
        const totalPages = originalPdf.getPageCount();

        // Parse page ranges (e.g., "1-3, 5, 7-9") and extract pages into a single PDF
        const rangeParts = ranges.split(',').map(r => r.trim());

        const outputPdf = await PDFDocument.create();
        const pagesToCopy = new Set();

        for (const part of rangeParts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (isNaN(start) || isNaN(end)) continue;
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) pagesToCopy.add(i - 1);
                }
            } else {
                const pageNum = Number(part);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    pagesToCopy.add(pageNum - 1);
                }
            }
        }

        const sortedPages = Array.from(pagesToCopy).sort((a, b) => a - b);

        if (sortedPages.length === 0) {
            return res.status(400).json({ message: 'Invalid page range.' });
        }

        const copiedPages = await outputPdf.copyPages(originalPdf, sortedPages);
        copiedPages.forEach(page => outputPdf.addPage(page));

        const outputBytes = await outputPdf.save();
        const fileName = `split-${Date.now()}.pdf`;
        const outputPath = path.join(os.tmpdir(), fileName);

        fs.writeFileSync(outputPath, outputBytes);

        res.download(outputPath, fileName, (err) => {
            if (err) console.error(err);
            fs.unlink(file.path, () => { });
        });

    } catch (error) {
        console.error('Split Error:', error);
        res.status(500).json({ message: 'Error splitting PDF' });
    }
};

/**
 * Compress a PDF file by re-saving it with pdf-lib optimization.
 * 
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads the compressed PDF file
 */
const compressPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'A PDF file is required.' });
        }

        const file = req.files[0];

        if (!isValidPdf(file.path)) {
            fs.unlink(file.path, () => { });
            return res.status(400).json({ message: 'Invalid PDF file.' });
        }

        const fileBytes = fs.readFileSync(file.path);

        const originalPdf = await PDFDocument.load(fileBytes);
        const compressedPdf = await PDFDocument.create();
        const pages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());

        pages.forEach(page => compressedPdf.addPage(page));

        // Using useObjectStreams: false for better compatibility
        const outputBytes = await compressedPdf.save({ useObjectStreams: false });

        const fileName = `compressed-${Date.now()}.pdf`;
        const outputPath = path.join(os.tmpdir(), fileName);

        fs.writeFileSync(outputPath, outputBytes);

        res.setHeader('X-Compressed-Size', outputBytes.length);

        res.download(outputPath, fileName, (err) => {
            if (err) console.error(err);
            fs.unlink(file.path, () => { });
        });

    } catch (error) {
        console.error('Compression Error:', error);
        res.status(500).json({ message: 'Error compressing PDF' });
    }
};

module.exports = { mergePdfs, splitPdf, compressPdf };
