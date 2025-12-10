const nodemailer = require("nodemailer");
  const { config } = require("../config/config");

  function createTransporter() {
    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
      console.warn("Email config missing; emails will not be sent.");
      return null;
    }

    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  async function sendEmail(to, subject, html) {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("Email fallback log:", { to, subject });
      return;
    }

    await transporter.sendMail({
      from: config.smtp.from || config.smtp.user,
      to,
      subject,
      html,
    });
  }

  async function sendTwoFactorCode(email, code) {
    const html = `<p>Your Global Travel Insight verification code is:</p>
<p style="font-size:20px;font-weight:bold">${code}</p>
<p>This code will expire in 10 minutes.</p>`;
    await sendEmail(email, "Your Global Travel Insight verification code", html);
  }

  async function sendPasswordReset(email, resetLink) {
    const html = `<p>You requested a password reset for Global Travel Insight.</p>
<p>Click the link below to set a new password:</p>
<p><a href="${resetLink}">${resetLink}</a></p>
<p>If you did not request this, you can ignore this email.</p>`;
    await sendEmail(email, "Reset your Global Travel Insight password", html);
  }

  module.exports = { sendTwoFactorCode, sendPasswordReset };