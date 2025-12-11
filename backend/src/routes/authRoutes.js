const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { config } = require("../config/config");
const { sendTwoFactorCode, sendPasswordReset } = require("../services/emailService");
const { authMiddleware, requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    config.jwtSecret,
    { expiresIn: "1h" }
  );
}

function setAuthCookie(res, token) {
  res.cookie("gtoken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 1000,
  });
}

router.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash: hash,
      role: role === "ADMIN" ? "ADMIN" : "USER",
    });

    res.status(201).json({
      message: "Account created. Please sign in.",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (config.disable2FA) {
      const token = signToken(user);
      setAuthCookie(res, token);
      return res.json({
        message: "Login successful (2FA disabled for dev)",
        authenticated: true,
        user: { id: user._id, email: user.email, role: user.role },
      });
    }

    const code = ("" + Math.floor(100000 + Math.random() * 900000)).slice(-6);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.twoFactorCode = code;
    user.twoFactorExpiresAt = expires;
    await user.save();

    const tip = `2FA code for ${user.email}: ${code}`;
    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
      console.log("Email config missing; 2FA email will not be sent.");
      console.log(tip);
    } else {
      await sendTwoFactorCode(user.email, code);
    }

    res.json({
      requires2FA: true,
      message: "Verification code sent. Complete two-step verification.",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/verify-2fa", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.twoFactorCode || !user.twoFactorExpiresAt) {
      return res.status(401).json({ error: "2FA session expired. Please login again." });
    }

    if (user.twoFactorExpiresAt.getTime() < Date.now()) {
      user.twoFactorCode = undefined;
      user.twoFactorExpiresAt = undefined;
      await user.save();
      return res.status(401).json({ error: "2FA code expired. Please login again." });
    }

    if (user.twoFactorCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.twoFactorCode = undefined;
    user.twoFactorExpiresAt = undefined;
    await user.save();

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      authenticated: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Verify 2FA error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("gtoken");
  res.json({ message: "Logged out" });
});

router.get("/me", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, user: req.user });
});

// password reset
router.post("/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: "If that account exists, a reset email has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/reset-password?token=${token}`;

    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
      console.log("Email config missing; reset email will not be sent.");
      console.log(
        `Password reset link for ${user.email}: ${resetLink}`
      );
    } else {
      await sendPasswordReset(user.email, resetLink);
    }

    res.json({ message: "If that account exists, a reset email has been sent." });
  } catch (err) {
    console.error("Request reset error:", err);
    res.status(500).json({ error: "Could not start password reset" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Reset link is invalid or has expired" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.json({ message: "Password has been reset. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Could not reset password" });
  }
});

module.exports = router;