const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
    console.error("Supabase URL or Service Key missing on server.");
}

/**
 * Middleware to verify Supabase authentication tokens.
 * Extracts the Bearer token from the Authorization header and validates it with Supabase.
 * Attaches the authenticated user to req.user if successful.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        if (!supabase) {
            // Fallback or error if env not set
            return res.status(500).json({ message: 'Server Auth configuration error' });
        }

        // Verify token using Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            // console.error('Auth verification failed:', error?.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Attach user to request
        req.user = { id: user.id, email: user.email };
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
