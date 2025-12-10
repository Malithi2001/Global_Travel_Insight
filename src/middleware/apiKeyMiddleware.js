const apiKeyMiddleware = (req, res, next) => {
    // Placeholder to bypass the API key check
    console.log("API Key check skipped (Placeholder)");
    next();
};

// NOTICE: We are now exporting it inside an object { } to match the import statement
module.exports = { apiKeyMiddleware };