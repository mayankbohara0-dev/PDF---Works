const fs = require('fs');

/**
 * Validates if a file is a valid PDF by checking its magic bytes (file signature).
 * Reads the first 4 bytes of the file and checks for the PDF signature: %PDF
 * 
 * @param {string} filePath - Absolute path to the file to validate
 * @returns {boolean} True if the file has a valid PDF signature, false otherwise
 */
const isValidPdf = (filePath) => {
    try {
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);

        const signature = buffer.toString();
        // Check for %PDF signature (0x25 0x50 0x44 0x46)
        const isValid = signature === '%PDF';

        if (!isValid) {
            console.log(`[Validation Debug] File: ${filePath}`);
            console.log(`[Validation Debug] First 4 bytes: ${signature} (Hex: ${buffer.toString('hex')})`);
        }

        return isValid;
    } catch (error) {
        console.error('Validation Error:', error);
        return false;
    }
};

module.exports = { isValidPdf };
