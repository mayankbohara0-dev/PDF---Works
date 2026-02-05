require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cleanupArgs = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Static files (if needed for uploads, though we might want to keep them private/streamed)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
// Supabase transition: Auth and DB moved to Supabase (Client-side mainly, Server verifies tokens)
console.log('Using Supabase for Database & Auth');
console.log('Env Check:', {
    URL: process.env.SUPABASE_URL ? 'Loaded' : 'Missing',
    KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing'
});

// Routes
// app.use('/api/auth', require('./routes/auth.routes')); // Not needed with Supabase
app.use('/api/pdf', require('./routes/pdf.routes'));

// Root Route
app.get('/', (req, res) => {
    res.send('PDFWorks API is running');
});

// Start Cleanup Job
cleanupArgs.startCleanupJob();

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
