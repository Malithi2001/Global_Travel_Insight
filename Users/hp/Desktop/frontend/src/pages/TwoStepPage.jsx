import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verify2FA } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

function TwoStepPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    // no email context -> send back
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verify2FA({ email, code });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo-badge">🔒</div>
        <h1 className="auth-title">Two-Step Verification</h1>
        <p className="auth-subtitle">
          Enter the 6-digit verification code sent to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Verification code
            <input
              className="auth-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="123456"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn-primary" disabled={loading}>
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
          <button
            type="button"
            className="auth-btn-secondary"
            onClick={handleCancel}
          >
            Cancel and go back to login
          </button>
        </form>

        <p className="auth-tip">
          Tip: during development, the 2FA code is also printed in the backend
          terminal window.
        </p>
      </div>
    </section>
  );
}

export default TwoStepPage;