const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.gtoken ||
      (req.headers.authorization || "").replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { authMiddleware, requireAuth, requireRole };