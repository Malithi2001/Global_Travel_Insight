import React, { useState } from "react";
import { requestPasswordReset } from "../services/authService.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to request reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo-badge">🔑</div>
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email Address
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;