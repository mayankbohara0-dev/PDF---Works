const fs = require('fs');
const path = require('path');

// Configuration
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const PROCESSED_DIR = path.join(__dirname, '../processed');
const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clean up old files in a directory based on modification time.
 * Files older than MAX_AGE_MS will be deleted.
 * 
 * @param {string} directory - Path to the directory to clean
 */

const cleanupDirectory = (directory) => {
    if (!fs.existsSync(directory)) return;

    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading ${directory}:`, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error checking stats for ${file}:`, err);
                    return;
                }

                if (Date.now() - stats.mtime.getTime() > MAX_AGE_MS) {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Error deleting ${file}:`, err);
                        else console.log(`Deleted old file: ${file}`);
                    });
                }
            });
        });
    });
};

/**
 * Start the automatic file cleanup job.
 * Runs immediately and then every CLEANUP_INTERVAL_MS.
 */
const startCleanupJob = () => {
    // Run initial cleanup
    cleanupDirectory(UPLOADS_DIR);
    cleanupDirectory(PROCESSED_DIR);

    // Schedule cleanup every 5 minutes
    setInterval(() => {
        cleanupDirectory(UPLOADS_DIR);
        cleanupDirectory(PROCESSED_DIR);
    }, CLEANUP_INTERVAL_MS);
};

module.exports = { startCleanupJob };
