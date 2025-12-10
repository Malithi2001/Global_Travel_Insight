const mongoose = require("mongoose");

const searchRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    country: String,
    capital: String,
    summary: String,
    risk: { type: String, default: "Unknown" },
    searchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchRecord", searchRecordSchema);