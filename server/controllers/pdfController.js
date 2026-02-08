const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { isValidPdf } = require('../utils/validation');

const mergePdfs = async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ message: 'At least 2 files are required.' });
        }

        // Validate all files first
        for (const file of req.files) {
            if (!isValidPdf(file.path)) {
                // Cleanup invalid file immediately
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

        // No need to ensure directory exists for os.tmpdir()

        fs.writeFileSync(outputPath, mergedPdfBytes);

        // Stream file back to client properly
        res.download(outputPath, fileName, (err) => {
            if (err) {
                console.error('File download error:', err);
            }
            // Cleanup input files immediately after processing? 
            // Or let the scheduled job handle it. 
            // For privacy, maybe better to delete input files now.
            req.files.forEach(f => {
                fs.unlink(f.path, () => { });
            });
            // Output file will be cleaned up by cron job
        });

    } catch (error) {
        console.error('Merge Error:', error);
        res.status(500).json({ message: 'Error merging PDFs' });
    }
};

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

        const ranges = req.body.ranges; // "1-2, 5, 7-9"

        if (!ranges) {
            return res.status(400).json({ message: 'Page ranges are required.' });
        }

        const fileBytes = fs.readFileSync(file.path);
        const originalPdf = await PDFDocument.load(fileBytes);
        const totalPages = originalPdf.getPageCount();

        // Parse ranges
        const rangeParts = ranges.split(',').map(r => r.trim());
        const newPdfInfo = []; // Array to store info for creating multiple PDFs if needed
        // For simplicity, we'll create ONE PDF if only one range is specified, or a ZIP if multiple "groups" are conceptually distinct?
        // Actually, the common pattern is: input "1-3, 5" -> Output ONE PDF with pages 1, 2, 3, 5. 
        // OR Output separate PDFs for "1-3" and "5".
        // Let's implement: Combine all selected pages into ONE new PDF for now (as per common "Extract Pages" behavior), 
        // OR user might want to split into single pages. 
        // The prompt says "Split PDF into smaller PDFs" -> "ZIP file of PDFs" or "Single PDF for selected range".
        // Let's treat the input strictly:
        // If the user inputs "1-2, 5" -> One PDF containing page 1, 2, 5.
        // If the user wants separate files, that's a different mode. For MVP, let's do "Extract Mode" -> Single Output.

        const outputPdf = await PDFDocument.create();

        // Helper to parse page numbers (1-based -> 0-based)
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

        // PDF-Lib compression (re-saving with object stream optimization)
        const originalPdf = await PDFDocument.load(fileBytes);
        const compressedPdf = await PDFDocument.create();
        const pages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());

        pages.forEach(page => compressedPdf.addPage(page));

        // Note: Using `useObjectStreams: false` for compatibility, 
        // but `true` might yield better results for PDF 1.5+.
        const outputBytes = await compressedPdf.save({ useObjectStreams: false });

        const fileName = `compressed-${Date.now()}.pdf`;
        const outputPath = path.join(os.tmpdir(), fileName);

        fs.writeFileSync(outputPath, outputBytes);

        // Expose new size for client logic
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
