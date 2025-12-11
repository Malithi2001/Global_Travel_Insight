const { config } = require("../config/config");

function apiKeyMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
}

module.exports = { apiKeyMiddleware };