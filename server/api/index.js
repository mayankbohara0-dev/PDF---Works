const app = require('../server'); // Import the Express app

// Vercel serverless function handler
module.exports = (req, res) => {
    app(req, res);
};
