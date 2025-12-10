const express = require("express");
const { apiKeyMiddleware } = require("../middleware/apiKeyMiddleware");
const { authMiddleware, requireAuth } = require("../middleware/authMiddleware");
const { searchCountry, getHistory } = require("../services/travelService");

const router = express.Router();

router.use(authMiddleware);
router.use(apiKeyMiddleware);

router.get("/search", requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const data = await searchCountry(q, req.user);
    res.json(data);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to search country" });
  }
});

router.get("/records", requireAuth, async (req, res) => {
  try {
    const records = await getHistory(req.user._id);
    res.json(records);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;