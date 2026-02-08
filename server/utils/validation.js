const fs = require('fs');

/**
 * Validates if the file at the given path is a valid PDF by checking magic bytes.
 * @param {string} filePath - Path to the file to check.
 * @returns {boolean} - True if valid PDF signature found.
 */
const isValidPdf = (filePath) => {
    try {
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);

        // Check for %PDF signature (0x25 0x50 0x44 0x46)
        return buffer.toString() === '%PDF';
    } catch (error) {
        console.error('Validation Error:', error);
        return false;
    }
};

module.exports = { isValidPdf };
