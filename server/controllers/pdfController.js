const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const os = require('os');
const path = require('path');
const archiver = require('archiver');
const { isValidPdf } = require('../utils/validation');
const { PdfRepair } = require('@peculiar/pdf-repair');
const { pdfToImg } = require('pdftoimg-js');
const { encryptPDF } = require('@pdfsmaller/pdf-encrypt-lite');

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

/**
 * Repair a corrupted or damaged PDF file.
 * 
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads the repaired PDF file
 */
const repairPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'A PDF file is required.' });
        }

        const file = req.files[0];
        const fileBytes = fs.readFileSync(file.path);

        try {
            // Attempt to load with pdf-lib first to check if repair is needed
            await PDFDocument.load(fileBytes, { ignoreEncryption: true });

            // If loading succeeds, file is already valid
            const fileName = `repaired-${Date.now()}.pdf`;
            const outputPath = path.join(os.tmpdir(), fileName);
            fs.writeFileSync(outputPath, fileBytes);

            res.download(outputPath, fileName, (err) => {
                if (err) console.error(err);
                fs.unlink(file.path, () => { });
            });
        } catch (loadError) {
            // File is corrupted, attempt repair
            const repair = new PdfRepair(fileBytes);
            const repairedBytes = await repair.fix();

            const fileName = `repaired-${Date.now()}.pdf`;
            const outputPath = path.join(os.tmpdir(), fileName);
            fs.writeFileSync(outputPath, repairedBytes);

            res.download(outputPath, fileName, (err) => {
                if (err) console.error(err);
                fs.unlink(file.path, () => { });
            });
        }
    } catch (error) {
        console.error('Repair Error:', error);
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(500).json({ message: 'Error repairing PDF. File may be too damaged.' });
    }
};

/**
 * Convert PDF pages to images (JPG, PNG, or WEBP).
 * Supports converting all pages or specific page ranges.
 * 
 * @param {Object} req - Express request object with file and body.format, body.pages
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads image(s) as single file or ZIP
 */
const pdfToImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'A PDF file is required.' });
        }

        const file = req.files[0];
        const format = req.body.format || 'png'; // jpg, png, webp
        const pages = req.body.pages || 'all'; // 'all' or '1-3'

        if (!isValidPdf(file.path)) {
            fs.unlink(file.path, () => { });
            return res.status(400).json({ message: 'Invalid PDF file.' });
        }

        // Convert PDF to images
        const images = await pdfToImg(file.path, {
            format: format,
            scale: 2, // Higher quality
        });

        // If only one page, return single image
        if (images.length === 1) {
            const fileName = `page-1-${Date.now()}.${format}`;
            const outputPath = path.join(os.tmpdir(), fileName);
            fs.writeFileSync(outputPath, images[0]);

            res.download(outputPath, fileName, (err) => {
                if (err) console.error(err);
                fs.unlink(file.path, () => { });
            });
        } else {
            // Multiple pages - create ZIP archive
            const zipFileName = `images-${Date.now()}.zip`;
            const zipPath = path.join(os.tmpdir(), zipFileName);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                res.download(zipPath, zipFileName, (err) => {
                    if (err) console.error(err);
                    fs.unlink(file.path, () => { });
                    fs.unlink(zipPath, () => { });
                });
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);

            // Add each image to the archive
            images.forEach((imgBuffer, index) => {
                archive.append(imgBuffer, { name: `page-${index + 1}.${format}` });
            });

            await archive.finalize();
        }
    } catch (error) {
        console.error('PDF to Image Error:', error);
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(500).json({ message: 'Error converting PDF to images' });
    }
};

/**
 * Protect a PDF with password encryption.
 * 
 * @param {Object} req - Express request object with file and body.password
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Downloads the encrypted PDF file
 */
const protectPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'A PDF file is required.' });
        }

        const file = req.files[0];
        const password = req.body.password;

        if (!password || password.length < 1) {
            fs.unlink(file.path, () => { });
            return res.status(400).json({ message: 'Password is required.' });
        }

        if (!isValidPdf(file.path)) {
            fs.unlink(file.path, () => { });
            return res.status(400).json({ message: 'Invalid PDF file.' });
        }

        const fileBytes = fs.readFileSync(file.path);

        // Encrypt the PDF
        const encryptedBytes = await encryptPDF(fileBytes, {
            userPassword: password,
            ownerPassword: password,
            permissions: {
                printing: req.body.allowPrint !== false,
                modifying: req.body.allowModify !== false,
                copying: req.body.allowCopy !== false,
                annotating: req.body.allowAnnotate !== false,
            }
        });

        const fileName = `protected-${Date.now()}.pdf`;
        const outputPath = path.join(os.tmpdir(), fileName);
        fs.writeFileSync(outputPath, encryptedBytes);

        res.download(outputPath, fileName, (err) => {
            if (err) console.error(err);
            fs.unlink(file.path, () => { });
        });
    } catch (error) {
        console.error('Protect PDF Error:', error);
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(500).json({ message: 'Error protecting PDF' });
    }
};

/**
 * Convert PDF to Word (DOCX) format.
 * Note: This is a placeholder function. Full implementation requires external API.
 * 
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns 501 Not Implemented for now
 */
const pdfToWord = async (req, res) => {
    try {
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(501).json({
            message: 'PDF to Word conversion is coming soon! This feature requires advanced OCR and layout detection.',
            feature: 'pdfToWord',
            status: 'planned'
        });
    } catch (error) {
        console.error('PDF to Word Error:', error);
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(500).json({ message: 'Error processing PDF to Word conversion' });
    }
};

/**
 * Convert PDF to Excel (XLSX) format.
 * Note: This is a placeholder function. Full implementation requires external API.
 * 
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns 501 Not Implemented for now
 */
const pdfToExcel = async (req, res) => {
    try {
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(501).json({
            message: 'PDF to Excel conversion is coming soon! This feature requires advanced table detection and data extraction.',
            feature: 'pdfToExcel',
            status: 'planned'
        });
    } catch (error) {
        console.error('PDF to Excel Error:', error);
        if (req.files && req.files[0]) {
            fs.unlink(req.files[0].path, () => { });
        }
        res.status(500).json({ message: 'Error processing PDF to Excel conversion' });
    }
};

module.exports = {
    mergePdfs,
    splitPdf,
    compressPdf,
    repairPdf,
    pdfToImage,
    protectPdf,
    pdfToWord,
    pdfToExcel
};
