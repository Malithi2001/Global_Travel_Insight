// 1. Basic Auth Middleware Placeholder
const authMiddleware = (req, res, next) => {
    console.log("Auth check skipped (Placeholder)");
    // We attach a fake admin user so admin routes don't crash later
    req.user = { 
        // FIX: Use a real hex string instead of "placeholder_id"
        _id: "507f1f77bcf86cd799439011", 
        role: "ADMIN",
        email: "admin@test.com" 
    };
    next();
};

// 2. Role Check Middleware Placeholder
const requireRole = (role) => {
    return (req, res, next) => {
        console.log(`Role check for '${role}' skipped (Placeholder)`);
        next();
    };
};

// Export all functions
module.exports = { 
    authMiddleware,
    requireAuth: authMiddleware, // Alias for requireAuth
    requireRole              
};