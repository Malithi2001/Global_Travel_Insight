const express = require("express");
const User = require("../models/User");
const SearchRecord = require("../models/SearchRecord");
const { authMiddleware, requireAuth, requireRole } = require("../middleware/authMiddleware");
const { apiKeyMiddleware } = require("../middleware/apiKeyMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(apiKeyMiddleware);
router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.get("/overview", async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSearches = await SearchRecord.countDocuments();
  res.json({ totalUsers, totalSearches });
});

module.exports = router;