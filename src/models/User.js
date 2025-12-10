const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

    // 2FA
    twoFactorCode: { type: String },
    twoFactorExpiresAt: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);